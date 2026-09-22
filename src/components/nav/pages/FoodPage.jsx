import React, { useState, useMemo } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import FoodItem from "./ChildPage/FoodItem"
import { useSavedComposite } from "../../SavedCompositeContext"
import { useData } from '../../DataContext';
import DataLoadError from "../../DataLoadError";


const COLORS = {
  primary: '#c60c30',    // HK flag red
  background: '#f2f2f2', // light neutral
  formBg: '#ffffff',     // white for form
  buttonText: '#ffffff'
};

// helper to extract numeric cost
function parseEstimatedCost(raw) {
  if (raw == null) return Infinity;
  if (typeof raw === "number") return raw;
  if (typeof raw === "string") {
    const num = parseFloat(raw.replace(/[^\d.]/g, ""));
    return isNaN(num) ? Infinity : num;
  }
  return Infinity;
}


export default function FoodPage() {
  const { foods, loading, error, retry } = useData();
  const { isSaved, toggle } = useSavedComposite();

  //filter: implement 'refine data' pattern
  const [filterClassification, setFilterClassification] = useState("");
  const [filterRecommended, setFilterRecommended] = useState(false);
  const [sortPrice, setSortPrice] = useState("");

  //clear filter
  const clearFilters = () => {
    setFilterClassification("");
    setFilterRecommended(false);
    setSortPrice("");
  };

  //derive unique food classification
  const foodClass = useMemo(() => {
    const set = new Set();
    foods.forEach((f) => {
      if (f.classification) set.add(f.classification);
    });
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b));
    // move "Staple Food" to front if present
    const stapleIdx = arr.indexOf("Staple Food");
    if (stapleIdx > -1) {
      arr.splice(stapleIdx, 1);
      arr.unshift("Staple Food");
    }
    return arr;
  }, [foods]);

  //Filtering
  const filteredAndSorted = useMemo(() => {
    let list = foods.filter((food) => {
      if (filterClassification && food.classification !== filterClassification) return false;
      if (filterRecommended && !food.highlyRecommended) return false;
      return true;
    });

    if (sortPrice === "price-asc") {
      list = [...list].sort(
        (a, b) => parseEstimatedCost(a.estimatedMinCost) - parseEstimatedCost(b.estimatedMinCost)
      );
    } else if (sortPrice === "price-desc") {
      list = [...list].sort(
        (a, b) => parseEstimatedCost(b.estimatedMinCost) - parseEstimatedCost(a.estimatedMinCost)
      );
    }

    return list;
  }, [foods, filterClassification, filterRecommended, sortPrice]);



  if (loading) return <div>Loading...</div>;
  if (error) return <DataLoadError error={error} onRetry={retry} title="We couldn't load the food guide." />;


  return <div style={{ backgroundColor: COLORS.background, minHeight: '100vh', padding: '2rem' }}>
    <Container>
      <h1 style={{ color: COLORS.primary, marginBottom: '0.5rem' }}>Food</h1>
      <p style={{ color: '#333', marginBottom: '1.5rem' }}>Explore Food in Hong Kong! Estimated cost is the suggested minimum spend to enjoy the full experience. </p>

      <Card style={{ backgroundColor: COLORS.formBg, borderColor: COLORS.primary, marginBottom: "2rem" }}>
        <Card.Body>
          <Card.Title as="h2" style={{ color: COLORS.primary, fontSize: "1.25rem" }}>
            Refine Food
          </Card.Title>
          <Form className="d-flex flex-wrap align-items-end">
            <Form.Group controlId="filterClassification" className="me-3 mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Classification</Form.Label>
              <Form.Select
                value={filterClassification}
                style={{ cursor: "pointer" }}
                onChange={(e) => setFilterClassification(e.target.value)}
                aria-label="Filter by classification"
              >
                <option value="">All</option>
                {foodClass.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="sortPrice" className="me-3 mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Sort by Price</Form.Label>
              <Form.Select
                value={sortPrice}
                style={{ cursor: "pointer" }}
                onChange={(e) => setSortPrice(e.target.value)}
                aria-label="Sort by price"
              >
                <option value="">None</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="filterRecommended" className="me-3 mb-3" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  id="filterRecommended"
                  type="checkbox"
                  checked={filterRecommended}
                  onChange={(e) => setFilterRecommended(e.target.checked)}
                  style={{ cursor: "pointer", margin: 0, width: 16, height: 16, flexShrink: 0, }}
                  className="form-check-input"
                />
                <label htmlFor="filterRecommended" style={{ margin: 2, userSelect: "none" }}>
                  Highly Recommended
                </label>
              </div>
            </Form.Group>

            <Button
              onClick={clearFilters}
              type="button"
              style={{
                backgroundColor: COLORS.primary,
                borderColor: COLORS.primary,
                color: COLORS.buttonText,
              }}
              className="mb-3"
            >
              Clear Filters
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {filteredAndSorted.length === 0 ? (
        <Card style={{ padding: "1rem", borderRadius: 8, marginTop: 12 }}>
          <Card.Body>
            <p style={{ margin: 0 }}>
              No matching food items. Try clearing the filters or broadening the criteria.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {filteredAndSorted.map((food) => (
            <Col key={food.id}>
              <FoodItem
                food={food}
                saved={isSaved("food", food.id)}
                onToggleSave={() => toggle("food", food.id)}
              />
            </Col>
          ))}
        </Row>
      )}

    </Container>
  </div>
}

