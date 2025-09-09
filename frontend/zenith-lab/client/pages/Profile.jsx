// import React, { useState } from 'react';

// const RandomCartoonAnimal = () => {
//   const [seed, setSeed] = useState(Math.random().toString(36).substring(7));

//   const refreshImage = () => {
//     setSeed(Math.random().toString(36).substring(7));
//   };

//   const imageUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;

//   return (
//     <div style={{ textAlign: 'center' }}>
//       <img
//         src={imageUrl}
//         alt="Random Cartoon Animal"
//         style={{ width: 200, height: 200, borderRadius: '50%', border: '3px solid #4CAF50' }}
//       />
//       <br />
//       <button
//         onClick={refreshImage}
//         style={{
//           marginTop: 10,
//           padding: '8px 16px',
//           backgroundColor: '#4CAF50',
//           color: 'white',
//           border: 'none',
//           borderRadius: 5,
//           cursor: 'pointer',
//           fontWeight: 'bold',
//         }}
//       >
//         Next Cartoon Avatar
//       </button>
//     </div>
//   );
// };

// export default RandomCartoonAnimal;



import React, { useState } from "react";

const styles = [
  "bottts",
  "avataaars",
  "pixel-art",
  "adventurer",
  "thumbs",
  "micah",
  "gridy",
];

const RandomFunnyCartoon = () => {
  const [seed, setSeed] = useState(Math.random().toString(36).substring(7));
  const [style, setStyle] = useState(styles[0]);

  const generateRandom = () => {
    const newSeed = Math.random().toString(36).substring(7);
    let newStyle = styles[Math.floor(Math.random() * styles.length)];

    // Avoid same style consecutively
    while (newStyle === style) {
      newStyle = styles[Math.floor(Math.random() * styles.length)];
    }

    setSeed(newSeed);
    setStyle(newStyle);
  };

  const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <img
        src={avatarUrl}
        alt="Funny Cartoon Avatar"
        style={{
          width: 250,
          height: 250,
          borderRadius: "50%",
          border: "5px solid #FF6347",
          boxShadow: "0 0 15px #FF6347",
        }}
      />
      <h3 style={{ marginTop: 10, fontFamily: "Comic Sans MS, cursive, sans-serif", color: "#FF6347" }}>
        Style: {style}
      </h3>
      <button
        onClick={generateRandom}
        style={{
          marginTop: 15,
          backgroundColor: "#FF6347",
          border: "none",
          padding: "10px 25px",
          borderRadius: 8,
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: 16,
          fontFamily: "Comic Sans MS, cursive, sans-serif",
          boxShadow: "0 0 10px #FF6347",
        }}
      >
        Generate Fun Avatar
      </button>
    </div>
  );
};

export default RandomFunnyCartoon;
