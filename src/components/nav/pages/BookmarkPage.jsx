import React, { useState } from "react";
import SavedAttractionsSection from "./ChildPage/SavedAttractionsSection";
import SavedFoodSection from "./ChildPage/SavedFoodSection"
import { Container } from "react-bootstrap"
import { useData } from "../../DataContext";
import DataLoadError from "../../DataLoadError";

const COLORS = {
  primary: '#c60c30',    // HK flag red
  background: '#f2f2f2', // light neutral
  formBg: '#ffffff',     // white for form
  buttonText: '#ffffff'
};

const LINK_STYLE = {
  color: "#c60c30",
  fontWeight: 500,
  margin: "0 1rem",
  textDecoration: "none",
  padding: "6px 4px",
  cursor: "pointer",
};

export default function BookmarkPage() {
  const [activeTab, setActiveTab] = useState("attractions");
  const { loading, error, retry } = useData();

  const makeTabStyle = (key) => {
    const base = { ...LINK_STYLE };
    if (activeTab === key) {
      return {
        ...base,
        fontWeight: 600,
        borderBottom: `3px solid ${COLORS.primary}`,
      };
    }
    return base;
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <DataLoadError error={error} onRetry={retry} title="We couldn't load your bookmarked content." />;

  return (
    <div style={{ backgroundColor: COLORS.background, minHeight: '100vh', padding: '2rem' }}>
      <Container>
        <h1 style={{ color: COLORS.primary, marginBottom: '0.5rem' }}>Bookmark</h1>
        <p style={{ color: '#333', marginBottom: '1.5rem' }}>Save your favorite tourist attraction and food here! </p>

        {/* nav bar*/}
        <nav aria-label="Saved categories" role="tablist" style={{ display: "flex", gap: 0, marginBottom: 16 }}>
          <div
            role="tab"
            aria-selected={activeTab === "attractions"}
            onClick={() => setActiveTab("attractions")}
            style={makeTabStyle("attractions")}
          >
            Saved Attractions
          </div>

          <div
            role="tab"
            aria-selected={activeTab === "food"}
            onClick={() => setActiveTab("food")}
            style={makeTabStyle("food")}
          >
            Saved Food
          </div>
        </nav>

        {/* content*/}
        {activeTab === "attractions" && <SavedAttractionsSection />}
        {activeTab === "food" && <SavedFoodSection />}
      </Container>
    </div>

  );
}
