// src/components/nav/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Carousel, Spinner, Alert } from "react-bootstrap";
import DataLoadError from "../../DataLoadError";

export default function HomePage() {
  const [slides, setSlides]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const base = import.meta.env.BASE_URL;
    setLoading(true);
    setError(null);

    fetch(`${base}data/HomePageData.json`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Homepage data has an invalid format.");
        }
        setSlides(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load carousel data:", err);
          setError(err);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [requestKey]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <DataLoadError
        error={error}
        onRetry={() => setRequestKey((current) => current + 1)}
        title="We couldn't load the homepage."
      />
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
