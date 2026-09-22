// src/components/nav/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Carousel, Spinner, Alert } from "react-bootstrap";

export default function HomePage() {
  const [slides, setSlides]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;

    fetch(`${base}data/HomePageData.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSlides(data);
      })
      .catch((err) => {
        console.error("Failed to load carousel data:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-5">
        Cannot load: {error.message}
      </Alert>
    );
  }

  if (!slides.length) {
    return (
      <Alert variant="warning" className="my-5">
        There is no content to display.
      </Alert>
    );
  }

  return (
    <div style={{ backgroundColor: '#f2f2f2', padding: '2rem 0' }}>
    <div className="container">
      <h1 className="mb-4" style = {{color: "#c60c30"}}>Welcome to HK</h1>
      <Carousel>
        {slides.map((slide, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={slide.src.startsWith("http") ? slide.src : `${import.meta.env.BASE_URL}${slide.src.replace(/^\/+/, "")}`}
              alt={slide.alt}
              style={{ objectFit: "cover", height: "60vh" }}
            />
            <Carousel.Caption>
              <h2>{slide.alt}</h2>
              <p>{slide.caption}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
    </div>
  );
}
