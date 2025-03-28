import React, { useState } from "react";

const Test = () => {
  const socialLinks = [
    {
      id: 1,
      type: "tiktok",
      label: "TikTok",
    },
    {
      id: 2,
      type: "instagram",
      label: "Instagram",
    },
    {
      id: 3,
      type: "whatsapp",
      label: "Whatsapp",
    },
  ];

  const [links, setLinks] = useState([]);

  const handleChange = (e, type, id) => {
    const { value } = e.target;
    // console.log("🚀 ~ Test ~ type:", type)

    const isExist = links.find(link => link?.id === id)
    if(!isExist){
      setLinks([...links, {
        id,
        type,
        url: value
      }])
    } else {
      if(value.length === 0){
        setLinks(links.filter(link => link.id !== id))
      } else {
        setLinks(links.map(link => {
          if(link.id === id){
            link.url = value
          }
          return link
        }))
      }
    }
  };

  console.log('links: ', links);

  return (
    <div>
      {socialLinks.map(({ id, label, type }) => (
        <div key={id} className="m-4">
          <label htmlFor={label} className="flex gap-x-3">
            <b>{label}</b>
            <input
              className="border "
              onChange={(e) => handleChange(e, type, id)}
              type="text"
              id={label}
              placeholder={label}
            />
          </label>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Test;
