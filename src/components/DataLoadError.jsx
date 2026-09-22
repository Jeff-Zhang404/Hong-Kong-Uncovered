import React from "react";
import { Alert, Button, Container } from "react-bootstrap";

export default function DataLoadError({
  error,
  onRetry,
  title = "We couldn't load this content.",
}) {
  return (
    <Container className="py-5">
      <Alert variant="danger" role="alert" className="mx-auto" style={{ maxWidth: 720 }}>
        <Alert.Heading>{title}</Alert.Heading>
        <p>
          Check your internet connection and try again. If the problem continues,
          the project data may be temporarily unavailable.
        </p>
        {error?.message && (
          <p className="small mb-3">
            Technical details: {error.message}
          </p>
        )}
        <Button type="button" variant="outline-danger" onClick={onRetry}>
          Try Again
        </Button>
      </Alert>
    </Container>
  );
}
