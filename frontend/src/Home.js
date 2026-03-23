import { useState } from "react";

function Home() {
    const [open, setOpen] = useState(false);
    const [orgName, setOrgName] = useState("");
    const [createdOrg, setCreatedOrg] = useState(null);

    const generateCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleCreate = () => {
        if (!orgName) return;

        setCreatedOrg({
            name: orgName,
            code: generateCode()
        });

        setOrgName("");
        setOpen(false);
    };

    return (
        <div style={{
            height: "100vh",
            background: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "100px",
            fontSize: "24px"
        }}>

            <h1>Welcome to Flourish</h1>

            {/* Dropdown container */}
            <div style={{ position: "relative", marginTop: "20px" }}>

                <button
                    onClick={() => setOpen(!open)}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer"
                    }}
                >
                    Create Organization ▾
                </button>

                {/* Dropdown */}
                {open && (
                    <div style={{
                        position: "absolute",
                        top: "45px",
                        left: "0",
                        background: "#f5f5f5",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "15px",
                        width: "250px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        zIndex: 10
                    }}>
                        <input
                            type="text"
                            placeholder="Organization name"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            style={{
                                padding: "8px",
                                fontSize: "14px"
                            }}
                        />

                        <button onClick={handleCreate}>
                            Create
                        </button>
                    </div>
                )}
            </div>

            {/* Output */}
            {createdOrg && (
                <div style={{
                    marginTop: "40px",
                    padding: "15px",
                    border: "1px solid black",
                    borderRadius: "8px"
                }}>
                    <p><strong>Organization:</strong> {createdOrg.name}</p>
                    <p><strong>Code:</strong> {createdOrg.code}</p>
                </div>
            )}

        </div>
    );
}

export default Home;