import { useState } from "react";

function Home() {
    const [joinOpen, setJoinOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joinName, setJoinName] = useState("");

    const [orgSelectOpen, setOrgSelectOpen] = useState(false);

    const [open, setOpen] = useState(false);
    const [orgName, setOrgName] = useState("");
    const [createdOrg, setCreatedOrg] = useState(null);

    const generateCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleJoin = () => {
        if (!joinCode || !joinName) return;
        // Verify code here (not implemented)
        setJoinCode("");
        setJoinName("");
        setJoinOpen(false);
    
    }

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
            {/* Join button */}
            <div style={{ position: "fixed", top: "20px", right: "20px" }}>
                <button
                    onClick={() => setJoinOpen(!joinOpen)}
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        fontSize: "24px",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        background: "white",
                        lineHeight: 1
                    }}
                >
                    +
                </button>

            {/* Join popup */}
            {joinOpen && (
                <div style={{
                    position: "absolute",
                    top: "50px",
                    right: "0",
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
                        placeholder="Your name"
                        value={joinName}
                        onChange={(e) => setJoinName(e.target.value)}
                        style={{
                            padding: "8px",
                            fontSize: "14px"
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Organization code"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        style={{
                            padding: "8px",
                            fontSize: "14px"
                        }}
                    />
                    <button onClick={handleJoin}>
                        Join
                    </button>
                </div>
            )}
            </div>

            {/*Org select dropdown*/}
            <div style={{ position: "fixed", top: "24px", right: "80px", display: "flex", gap: "8px", alignItems: "center" }}>
                <button
                    onClick={() => setOrgSelectOpen(!orgSelectOpen)}
                    style={{
                        padding: "8px 12px",
                        fontSize: "14px",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        background: "white"
                    }}
                >
                    Select Organization ▾
                </button>

                {orgSelectOpen && (
                    <div style={{
                        position: "absolute",
                        top: "45px",
                        left: "0",
                        background: "#f5f5f5",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "10px",
                        width: "200px",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        zIndex: 10
                    }}>
                        <p style={{fontSize: "14px", color: "888", margin: 0}}>No organizations found.</p>

                    </div>
                )}
            </div>

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