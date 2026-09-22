import React, { useState, useMemo } from "react";
import { Row, Col, Card, Form, Container } from "react-bootstrap";
import { useSavedComposite } from "../../../SavedCompositeContext"
import { useData } from "../../../DataContext"
import SavedAttractionCard from "./SavedAttractionCard";

export default function SavedAttractionsSection() {

    const { tourists, loading } = useData();
    const { getSavedIdsByType } = useSavedComposite();

    const [regionFilter, setRegionFilter] = useState("All");
    const [interestFilter, setInterestFilter] = useState("All");
    const savedIds = getSavedIdsByType("tourist");

    const savedAttractions = useMemo(() => {
        return tourists
            .filter((t) => savedIds.includes(String(t.id)))
            .filter((a) => regionFilter === "All" || a.region === regionFilter)
            .filter(
                (a) =>
                    interestFilter === "All" ||
                    (Array.isArray(a.interests) && a.interests.includes(interestFilter))
            );
    }, [tourists, savedIds, regionFilter, interestFilter]);

    const regionOptions = useMemo(() => {
        const set = new Set(
            tourists
                .filter((t) => savedIds.includes(String(t.id)))
                .map((t) => t.region)
                .filter(Boolean)
        );
        return ["All", ...Array.from(set)];
    }, [tourists, savedIds]);

    const interestOptions = useMemo(() => {
        const set = new Set();
        tourists
            .filter((t) => savedIds.includes(String(t.id)))
            .forEach((t) => {
                if (Array.isArray(t.interests)) {
                    t.interests.forEach((i) => set.add(i));
                }
            });
        return ["All", ...Array.from(set)];
    }, [tourists, savedIds]);

    if (loading) {
        return <div>Loading saved attractions...</div>;
    }

    return (
            <Container>
            
            <Card
                style={{
                    padding: "1rem",
                    borderRadius: 8,
                    marginBottom: "1rem",
                    border: "1px solid #ccc",
                }}
            >
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <div>
                        <label htmlFor="region-select" style={{ fontWeight: 600, display: "block" }}>Region</label>
                        <Form.Select
                            id="region-select"
                            style={{ cursor: "pointer" }}
                            value={regionFilter}
                            onChange={(e) => setRegionFilter(e.target.value)}
                        >
                            {regionOptions.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}

                        </Form.Select>
                    </div>
                    <div>
                        <label htmlFor="interest-select" style={{ fontWeight: 600, display: "block" }}>Interest</label>
                        <Form.Select
                            id="interest-select"
                            style={{ cursor: "pointer" }}
                            value={interestFilter}
                            onChange={(e) => setInterestFilter(e.target.value)}
                        >
                            {interestOptions.map((i) => (
                                <option key={i} value={i}>
                                    {i}
                                </option>
                            ))}
                        </Form.Select>
                    </div>
                </div>
            </Card>
            {savedAttractions.length === 0 ? (
                <Card style={{ padding: "1rem", borderRadius: 8 }}>
                    <Card.Body>
                        <p style={{ margin: 0 }}>There are no saved attractions matching the filters.</p>
                    </Card.Body>
                </Card>
            ) : (
                <Row xs={1} md={2} className="g-4">
                    {savedAttractions.map((spot) => (
                        <Col key={spot.id}>
                            <SavedAttractionCard attraction={spot} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    )

}
