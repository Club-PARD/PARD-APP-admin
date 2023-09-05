import React from "react";
import styled from "styled-components";

const DDiv = styled.div`
  background: #f6f6f6;
  margin: 0 auto;
  padding: 20px 50px 20px 50px;
`;

const CheckPage = () => {
  return (
    <DDiv>
      <h1>Welcome to My CheckPage</h1>
      <p>This is some content on the home page.</p>
      {/* Add more components and content here */}
    </DDiv>
  );
};

export default CheckPage;
