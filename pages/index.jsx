import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { BsTrophy } from "react-icons/bs";
import { IconContext } from "react-icons";

const Home = ({ slugs }) => {
  return (
    <Row>
      <Col>
        <Card className="profile-card p-2">
          <Card.Img
            className="profile-img"
            variant="top"
            src="/bomberman.png"
          />
          <Card.Body>
            <Card.Title>Welcome, I'm Dimitris</Card.Title>
            <Card.Text className="h6 text-muted">
              Have a look around if you are interested in Javascript, React.js
              or front end development in general.
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Home;
