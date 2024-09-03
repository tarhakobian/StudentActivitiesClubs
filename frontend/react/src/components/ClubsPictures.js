import React from "react";
import {Card} from "react-bootstrap";
import data from "../data/data";
import "./ClubsPictures.css";

function ClubsPictures() {
    return (
        <div>
            <div className="filtered">
                <div>All</div>
                <div>Academic</div>
                <div>Careers</div>
                <div>Community Service</div>
                <div>Cultural</div>
                <div>Gaming</div>
                <div>Hobby</div>
                <div>Sports</div>
            </div>
            <div className="clubs-pictures">
                {data.map((item, index) => {
                    return (
                        <Card
                            border="dark"
                            style={{width: window.innerWidth <= 768 ? "11rem" : "12rem"}}
                        >
                            <Card.Img variant="top" src={item.imageUrl} height="200px"/>
                            <Card.Body>
                                <Card.Title className="clubs-title">{item.title}</Card.Title>
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

export default ClubsPictures;
