import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BsTrophy } from "react-icons/bs";
import { IconContext } from "react-icons";

const Home = ({ slugs }) => {
  return (
    <Row>
      <Col>
        <IconContext.Provider value={{ size: "20px" }}>
          <BsTrophy />
        </IconContext.Provider>
      </Col>
    </Row>
  );
};

export default Home;
