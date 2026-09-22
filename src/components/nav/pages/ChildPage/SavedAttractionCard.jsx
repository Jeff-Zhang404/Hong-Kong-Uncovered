import React from "react";
import { Card, Button } from "react-bootstrap";
import { useSavedComposite } from "../../../SavedCompositeContext"

export default function SavedAttractionCard({ attraction }) {
    const { toggle } = useSavedComposite();

    const handleUnsave = () => {
        toggle("tourist", attraction.id);
    };

    return (
        <Card
            className="h-100"
            style={{
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                position: "relative",
            }}
        >

            <Card.Body className="d-flex p-3 gap-3">

            <div
          style={{
            width: "40%",
            flexShrink: 0,
            borderRadius: 8,
            overflow: "hidden",
            position: "relative",
          }}
        >

          <Card.Img
            src={
              attraction.images?.[0]?.src?.startsWith("http")
                ? attraction.images[0].src
                : `${import.meta.env.BASE_URL || ""}${(attraction.images?.[0]?.src || "")
                    .replace(/^\/+/, "")}`
            }
            alt={attraction.images?.[0]?.alt || attraction.name}
            style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }}
          />
          
        </div>

        <div className="d-flex flex-column flex-grow-1" style={{ paddingRight: 8 }}>

            <h2 className="h5 mb-1">{attraction.name}</h2>
            <strong className="text-muted mb-1">{attraction.region}</strong>
            {Array.isArray(attraction.interests) && (
            <p className="text-muted mb-2">{attraction.interests.join(", ")}</p>
          )}

          <div className="mt-auto">
            <Button variant="danger" size="sm" onClick={handleUnsave}>Unsave</Button>
            
          </div>

        </div>

            </Card.Body>
        </Card>
    )
}

