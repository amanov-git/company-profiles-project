const db = require('../database');
const path = require('path');
const fs = require('fs').promises;
const fsExtra = require('fs-extra');
const pgFormat = require('pg-format');

const getAllCompanies = async (req, res) => {
  const getCompaniesQuery = `
    SELECT 
      COUNT(c.id) AS count,
      cat.category_name AS category,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', c.id,
          'company_name', c.company_name,
          'category_id', c.category_id
        )
      ) AS companies
    FROM 
      company_categories cat
    LEFT JOIN 
      companies c ON cat.id = c.category_id
    GROUP BY 
      cat.id, cat.category_name
    HAVING 
      COUNT(c.id) > 0
    ORDER BY 
      cat.id;
  `;

  try {
    const { rows } = await db.query(getCompaniesQuery);
    return res.status(200).json(rows);
  } catch (error) {
    console.log('Error: ', error);
    return res.sendStatus(500);
  };
};

const getCompanyDetails = async (req, res) => {
  const { companyID } = req.params;

  const getCompanyDetailsQuery = `
    WITH company_social_links AS (
        SELECT 
            c.id AS company_id,
            COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', csl.id, 'type', smt.type, 'url', csl.url)),
                '[]'
            ) AS links
        FROM 
            companies c
        LEFT JOIN company_social_links csl ON csl.company_id = c.id
        LEFT JOIN social_media_types smt ON smt.id = csl.type_id
        GROUP BY c.id
    ),
    services_info AS (
        SELECT 
            c.id AS company_id,
            COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', s.id, 'image', s.image, 'description', s.description)),
                '[]'
            ) AS services
        FROM 
            companies c
        LEFT JOIN services s ON s.company_id = c.id
        GROUP BY c.id
    ),
    contacts_info AS (
        SELECT 
            c.id AS company_id,
            COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                    'id', con.id,
                    'avatar', con.avatar,
                    'fullname', con.fullname,
                    'title', t.title,
                    'phone', con.phone,
                    'social_links', COALESCE(
                        (
                            SELECT 
                                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
                                    'id', consl.id,
                                    'url', consl.url,
                                    'type', smt.type
                                )) 
                            FROM contacts_social_links consl
                            LEFT JOIN social_media_types smt ON smt.id = consl.type_id
                            WHERE consl.contact_id = con.id
                        ),
                        '[]'
                    )
                )),
                '[]'
            ) AS contacts
        FROM 
            companies c
        LEFT JOIN contacts con ON con.company_id = c.id
        LEFT JOIN titles t ON t.id = con.title_id
        GROUP BY c.id
    )
    SELECT 
        c.id, 
        c.company_name, 
        TO_CHAR(c.founded_date, 'DD.MM.YYYY') AS founded_date, 
        c.company_logo,
        c.number_of_employees, 
        c.location, 
        c.website, 
        c.about, 
        cc.category_name,
        COALESCE(social_links.links, '[]') AS company_social_links,
        COALESCE(services.services, '[]') AS services,
        COALESCE(contacts.contacts, '[]') AS contacts_info
    FROM 
        companies c
    LEFT JOIN company_categories cc ON cc.id = c.category_id
    LEFT JOIN company_social_links social_links ON social_links.company_id = c.id
    LEFT JOIN services_info services ON services.company_id = c.id
    LEFT JOIN contacts_info contacts ON contacts.company_id = c.id
    WHERE 
        c.id = $1;
  `;

  try {
    const { rows } = await db.query(getCompanyDetailsQuery, [companyID]);
    if (rows.length === 0) {
      return res.status(400).send('Company id was not found.');
    };
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.log('Error: ', error);
    return res.sendStatus(500);
  };
};

const addNewCompanyOverview = async (req, res) => {
  const {
    userID,
    companyName,
    foundedAt,
    companyCategory,
    numberOfEmployees,
    location,
    website,
    about,
    companySocialLinks,
  } = req.body;

  const { companyLogo } = req.files;

  // const companySocialLinksParsed = JSON.parse(companySocialLinks);

  const companySocialLinksParsed = [
    { url: 'www.tiktok.com/some-company.com', type_id: 1 },
    { url: 'www.instagram.com/some-company.com', type_id: 2 },
  ];

  if (companyLogo.length === 0) {
    return res.status(400).send('Company logo is required');
  };

  const client = await db.connect();

  const insertIntoCompaniesQuery = `
    INSERT INTO companies (user_id, company_name, founded_date, category_id, number_of_employees, location, website, about) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `;

  try {
    await client.query('BEGIN');

    // Insert company and get companyID first
    const { rows: companyRows } = await client.query(insertIntoCompaniesQuery, [
      userID,
      companyName,
      foundedAt,
      companyCategory,
      numberOfEmployees,
      location,
      website,
      about,
    ]);

    const companyID = companyRows[0]?.id;

    if (!companyID) {
      throw new Error('Failed to retrieve company ID');
    }

    const companyLogoFolderName = `company-logo`;
    const companyLogoFolderPath = path.join(process.cwd(), '/src/files', companyID.toString(), companyLogoFolderName);

    await fsExtra.ensureDir(companyLogoFolderPath);

    const companyLogoFullPath = path.join(companyLogoFolderPath, companyLogo[0].originalname);

    await fsExtra.writeFile(companyLogoFullPath, companyLogo[0].buffer);

    const dbCompanyLogoSavePath = `/files/${companyID}/${companyLogoFolderName}/${companyLogo[0].originalname}`;

    // Update the company record with the logo path
    await client.query(
      `UPDATE companies SET company_logo = $1 WHERE id = $2`,
      [dbCompanyLogoSavePath, companyID]
    );

    if (companySocialLinksParsed.length > 1) {
      const insertIntoCompanySocialLinksQuery = `INSERT INTO company_social_links (url, type_id, company_id) VALUES %L`;

      const insertIntoCompanySocialLinksQueryPgFormat =
        pgFormat(
          insertIntoCompanySocialLinksQuery,
          companySocialLinksParsed.map((socialLink) => ([socialLink.url, socialLink.type_id, companyID])),
        );

      await client.query(insertIntoCompanySocialLinksQueryPgFormat, []);
    }

    await client.query('COMMIT');
    return res.status(200).json({ companyID: companyID });
  } catch (error) {
    await client.query('ROLLBACK');
    res.sendStatus(500);
    console.error('Error: ', error);
  }
};

const addNewCompanyServices = async (req, res) => {
  const { services, companyID } = req.body;
  const { servicesImages } = req.files;

  // const servicesConverted = JSON.parse(services.replace(/'/g, '"'));

  if (!companyID) {
    return res.status(400).send('Company ID is required.');
  };

  if (services.length === 0) {
    return res.status(400).send('Should be at least one service.');
  };

  const servicesParsed = JSON.parse(services);

  if (servicesImages.length < servicesParsed.length) {
    return res.status(400).send('All services must include image.')
  };

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const companyServicesImagesFolderName = 'services-images';

    const serviceImageFolderPath = path.join(process.cwd(), '/src/files', companyID, companyServicesImagesFolderName);

    await fsExtra.ensureDir(serviceImageFolderPath);

    const servicesImagesPrefix = `/files/${companyID}/${companyServicesImagesFolderName}`;

    const insertIntoServicesQuery = `
      INSERT INTO services (description, company_id, image)
      VALUES ${servicesParsed.map((service, index) => (
      `('${service}', ${companyID}, '${servicesImagesPrefix}/${servicesImages[index].originalname}')`
    ))}`;

    await client.query(insertIntoServicesQuery, []);

    for (let serviceImg of servicesImages) {
      const serviceImageFullPath = `${serviceImageFolderPath}/${serviceImg.originalname}`
      await fsExtra.writeFile(serviceImageFullPath, serviceImg.buffer)
    };

    await client.query('COMMIT');
    return res.sendStatus(200);

  } catch (error) {
    await client.query('ROLLBACK');
    res.sendStatus(500);
    console.error('Error: ', error);
  };
};

const addNewCompanyContact = async (req, res) => {
  const { fullname, titleID, phone, companyID, contactSocialLinks } = req.body;
  const contactAvatar = req.file;

  const contactSocialLinksParsed = JSON.parse(contactSocialLinks)

  const client = await db.connect();

  const insertContactQuery = `
    INSERT INTO contacts (avatar, fullname, title_id, phone, company_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  try {
    await client.query('BEGIN');

    let contactAvatarDbPath = '';

    if (contactAvatar) {
      const contactsAvatarsFolderName = `contacts-avatars`;

      contactAvatarDbPath = `/files/${companyID}/${contactsAvatarsFolderName}/${contactAvatar.originalname}`;

      const contactsAvatarsFolderPath = path.join(process.cwd(), 'src', 'files', companyID, contactsAvatarsFolderName);

      const contactAvatarFullPath = path.join(contactsAvatarsFolderPath, contactAvatar.originalname);

      await fsExtra.ensureDir(contactsAvatarsFolderPath);

      await fsExtra.writeFile(contactAvatarFullPath, contactAvatar.buffer);
    } else {
      contactAvatarDbPath = null;
    };

    const result = await client.query(insertContactQuery, [contactAvatarDbPath, fullname, titleID, phone, companyID]);

    const contactID = result.rows[0]?.id;

    const insertContactSocialLinkQuery = `INSERT INTO contacts_social_links (url, type_id, contact_id) VALUES %L`;

    const insertContactSocialLinkQueryPgFormat =
      pgFormat(
        insertContactSocialLinkQuery,
        contactSocialLinksParsed.map((link) => ([link.url, link.type_id, contactID])),
      );

    await client.query(insertContactSocialLinkQueryPgFormat, []);

    await client.query('COMMIT');
    return res.sendStatus(200);
  } catch (error) {
    await client.query('ROLLBACK');
    res.sendStatus(500);
    console.log('Error: ', error);
  };
};

const getUserCompanies = async (req, res) => {
  const { userID } = req.params;

  if (!userID) {
    return res.status(400).send('User ID is required.');
  };

  const getUserCompaniesQuery = `
    SELECT c.id, c.company_name FROM companies c 
    WHERE c.user_id = $1 
    ORDER BY c.company_name ASC
  `;

  try {
    const { rows } = await db.query(getUserCompaniesQuery, [userID]);
    return res.status(200).json(rows);
  } catch (error) {
    res.sendStatus(500);
    console.log('Error: ', error);
  };
};

const getAdminCompanies = async (req, res) => {
  const getCompaniesQuery = `SELECT c.id, c.company_name FROM companies c ORDER BY c.id ASC`;

  try {
    const result = await db.query(getCompaniesQuery, []);
    return res.status(200).json(result.rows);
  } catch (error) {
    res.sendStatus(500);
    console.log('Error: ', error);
  };
};

const getCompanyOverview = async (req, res) => {
  const { companyID } = req.params;

  if (!companyID) {
    return res.status(400).send('Company ID is required');
  };

  const getCompanyOverviewQuery = `
    SELECT 
        c.id, 
        c.company_name, 
        c.category_id, 
        TO_CHAR(c.founded_date, 'YYYY-MM-DD') AS founded_date,
        c.number_of_employees, 
        c.location,
        c.about,
        c.website,
        c.company_logo,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', csl.id,
                    'url', csl.url,
                    'type_id', csl.type_id,
                    'type', smt.type
                )
            ) FILTER (WHERE csl.id IS NOT NULL), '[]'
        ) AS company_social_links
    FROM "companies" c
    LEFT JOIN company_social_links csl ON csl.company_id = c.id
    LEFT JOIN social_media_types smt ON csl.type_id = smt.id
    WHERE c.id = $1
    GROUP BY c.id;
  `;

  try {
    const { rows } = await db.query(getCompanyOverviewQuery, [companyID]);

    return res.status(200).json(rows[0]);

  } catch (error) {
    res.sendStatus(500);
    console.log('Error: ', error);
  };
};

const getCompanyServices = async (req, res) => {
  const { companyID } = req.params;

  if (!companyID) {
    return res.status(400).send('Company ID is required.');
  };

  const getCompanyServicesQuery = `SELECT s.id, s.image, s.description FROM services s WHERE company_id = $1 ORDER BY s.id ASC`;

  try {
    const { rows } = await db.query(getCompanyServicesQuery, [companyID]);
    return res.status(200).json(rows);
  } catch (error) {
    res.sendStatus(500);
    console.error('Error: ', error);
  };
};

const getCompanyContacts = async (req, res) => {
  const { companyID } = req.params;

  if (!companyID) {
    return res.status(400).send('Company ID is required.');
  };

  const getContactsQuery = `
    SELECT 
        c.id, 
        c.avatar, 
        c.fullname, 
        c.phone, 
        c.title_id,
        COALESCE(JSONB_AGG(
            JSONB_BUILD_OBJECT('id', csl.id, 'url', csl.url, 'type_id', csl.type_id, 'type', smt.type)
        ) FILTER (WHERE csl.id IS NOT NULL), '[]') AS contacts_social_links
    FROM contacts c
    LEFT JOIN contacts_social_links csl ON csl.contact_id = c.id
    LEFT JOIN social_media_types smt ON csl.type_id = smt.id
    WHERE c.company_id = $1
    GROUP BY c.id;
  `;

  try {
    const result = await db.query(getContactsQuery, [companyID]);
    return res.status(200).send(result?.rows);
  } catch (error) {
    res.sendStatus(500);
    console.log('Error: ', error);
  };
};

const updateCompanyOverview = async (req, res) => {
  const {
    companyName,
    foundedAt,
    companyCategory,
    numberOfEmployees,
    location,
    website,
    about,
    companySocialLinks,
    companyID,
    currentCompanyLogo,
  } = req.body;

  const companyLogo = req.file;

  const companySocialLinksParsed = JSON.parse(companySocialLinks);

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    let dbCompanyLogoSavePath = '';

    if (companyLogo) {
      const companyLogoFolderName = `company-logo`;

      const companyLogoFolderPath = path.join(process.cwd(), '/src/files', companyID, companyLogoFolderName);

      const currentCompanyLogoPath = path.join(process.cwd(), 'src', currentCompanyLogo);

      dbCompanyLogoSavePath = `/files/${companyID}/${companyLogoFolderName}/${companyLogo.originalname}`;

      const companyLogoFullPath = path.join(companyLogoFolderPath, companyLogo.originalname);

      await fsExtra.ensureDir(companyLogoFolderPath);

      await fsExtra.writeFile(companyLogoFullPath, companyLogo.buffer);

      if (dbCompanyLogoSavePath !== currentCompanyLogo) {
        await fsExtra.remove(currentCompanyLogoPath);
      };
    } else {
      dbCompanyLogoSavePath = currentCompanyLogo;
    };

    const updateCompaniesQuery = `
      UPDATE companies
      SET 
        company_name = $1,
        founded_date = $2,
        category_id = $3,
        number_of_employees = $4,
        location = $5,
        website = $6,
        about = $7,
        company_logo = $9
        WHERE id = $8;
    `;

    await client.query(updateCompaniesQuery, [
      companyName,
      foundedAt,
      companyCategory,
      numberOfEmployees,
      location,
      website,
      about,
      companyID,
      dbCompanyLogoSavePath
    ]);

    // Update company social links
    const updateCompanySocialLinksQuery = companySocialLinksParsed.map((link) => `
      UPDATE company_social_links 
      SET url = '${link.url}', type_id = ${link.type_id}, company_id = ${companyID} 
      WHERE id = ${link.id};
    `).join(' ');

    await client.query(updateCompanySocialLinksQuery);

    await client.query('COMMIT');
    return res.sendStatus(200);

  } catch (error) {
    await client.query('ROLLBACK');
    res.sendStatus(500);
    console.error('Error: ', error);
  };
};

const updateCompanyService = async (req, res) => {
  const serviceImage = req.file;
  const { id, description, companyID, currentServiceImage } = req.body;

  let serviceImageDbPath = '';

  try {
    if (serviceImage) {
      const servicesImagesFolderName = `services-images`;

      const servicesImagesFolderPath = path.join(process.cwd(), 'src', 'files', companyID, servicesImagesFolderName);

      const serviceImageFullPath = path.join(servicesImagesFolderPath, serviceImage.originalname);

      serviceImageDbPath = `/files/${companyID}/${servicesImagesFolderName}/${serviceImage.originalname}`;

      const currentServiceImageFullPath = path.join(process.cwd(), 'src', currentServiceImage);

      try {
        await fsExtra.writeFile(serviceImageFullPath, serviceImage.buffer);

        if (currentServiceImage !== serviceImageDbPath) {
          await fsExtra.remove(currentServiceImageFullPath)
        };
      } catch (error) {
        console.log('Error creating and removing service image:', error);
      };

    } else {
      serviceImageDbPath = currentServiceImage;
    };

    const updateServiceQuery = `UPDATE services SET image = $1, description = $2 WHERE id = $3`;

    await db.query(updateServiceQuery, [serviceImageDbPath, description, id]);

    return res.sendStatus(200);

  } catch (error) {
    res.sendStatus(500);
    console.log('Error: ', error);
  };
};

const updateCompanyContact = async (req, res) => {
  const { contactID, currentAvatar, companyID, fullname, titleID, phone, socialLinks } = req.body;
  const contactAvatar = req.file;

  const socialLinksParsed = JSON.parse(socialLinks);

  const client = await db.connect();

  const updateContactQuery = `
    UPDATE contacts
    SET avatar = $1, fullname = $2, title_id = $3, phone = $4
    WHERE id = $5
  `;

  try {

    await client.query('BEGIN');

    let avatarDbFullPath = '';

    if (contactAvatar) {
      const contactsAvatarsFolderName = `contacts-avatars`;

      avatarDbFullPath = `/files/${companyID}/${contactsAvatarsFolderName}/${contactAvatar.originalname}`;

      const contactsAvatarsFolderPath = path.join(process.cwd(), 'src', 'files', companyID, contactsAvatarsFolderName);

      const avatarFullPath = path.join(contactsAvatarsFolderPath, contactAvatar.originalname);

      const currentAvatarFullPath = path.join(process.cwd(), 'src', currentAvatar);

      await fsExtra.ensureDir(contactsAvatarsFolderPath);

      await fsExtra.writeFile(avatarFullPath, contactAvatar.buffer);

      if (currentAvatar !== avatarDbFullPath) {
        await fsExtra.remove(currentAvatarFullPath);
      };
    } else {
      avatarDbFullPath = currentAvatar;
    };

    await client.query(updateContactQuery, [avatarDbFullPath, fullname, titleID, phone, contactID]);

    for (const link of socialLinksParsed) {
      await client.query(
        `UPDATE contacts_social_links
         SET url = $1, type_id = $2
         WHERE id = $3
        `,
        [link.url, link.type_id, link.id],
      );
    };

    await client.query('COMMIT');
    return res.sendStatus(200);

  } catch (error) {
    await client.query('ROLLBACK');
    res.sendStatus(500);
    console.log('Error: ', error);
  };
};

const deleteCompany = async (req, res) => {
  const { companyID } = req.params;

  if (!companyID) {
    return res.status(400).send('Company id is required.');
  };

  const deleteCompanyQuery = `DELETE FROM companies WHERE id = $1`;

  try {
    const deleteCompanyQueryResult = await db.query(deleteCompanyQuery, [companyID]);

    if (deleteCompanyQueryResult.rowCount === 0) {
      return res.status(404).send('Company ID was not found.');
    };

    const companyFolder = path.join(process.cwd(), 'src', 'files', companyID);

    await fs.rm(companyFolder, { recursive: true, force: true, maxRetries: 1 });

    return res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    console.error('Error: ', error);
  };
};

const getSearchCompanies = async (req, res) => {
  const { searchText } = req.query;

  const searchCompaniesQuery = `
    WITH service_agg AS (
        SELECT company_id, STRING_AGG(description, ', ') AS services
        FROM services
        GROUP BY company_id
    ),
    contact_agg AS (
        SELECT company_id, 
              STRING_AGG(fullname, ', ') AS contacts_fullname,
              STRING_AGG(phone, ', ') AS contacts_phone
        FROM contacts
        GROUP BY company_id
    )
    SELECT 
      cc.category_name,
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', c.id,
          'company_name', c.company_name
        )
      ) AS companies
    FROM companies c
    LEFT JOIN company_categories cc ON c.category_id = cc.id
    LEFT JOIN service_agg s ON s.company_id = c.id
    LEFT JOIN contact_agg con ON con.company_id = c.id
    WHERE c.company_name ILIKE $1 
      OR c.location ILIKE $1
      OR c.website ILIKE $1
      OR c.about ILIKE $1
      OR cc.category_name ILIKE $1
      OR s.services ILIKE $1
      OR con.contacts_fullname ILIKE $1
      OR con.contacts_phone ILIKE $1
    GROUP BY cc.category_name;
  `;

  try {
    const result = await db.query(searchCompaniesQuery, [`%${searchText}%`]);
    // const result = await db.query(searchCompaniesQuery, [`%%`]);
    return res.status(200).send(result?.rows);
  } catch (error) {
    res.sendStatus(500);
    console.log('Error: ', error);
  };
};

module.exports = {
  getAllCompanies,
  getCompanyDetails,
  addNewCompanyOverview,
  addNewCompanyServices,
  getUserCompanies,
  updateCompanyOverview,
  getCompanyOverview,
  getCompanyServices,
  getCompanyContacts,
  updateCompanyContact,
  deleteCompany,
  updateCompanyService,
  getAdminCompanies,
  getSearchCompanies,
  addNewCompanyContact,
};