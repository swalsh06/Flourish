import { useState } from "react";

function Home() {
    const [joinOpen, setJoinOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joinName, setJoinName] = useState("");
    const [orgSelectOpen, setOrgSelectOpen] = useState(false);
    const [open, setOpen] = useState(false);

    const userId = localStorage.getItem("userId");
    const [organizations, setOrganizations] = useState(() => {
        const saved = localStorage.getItem("organizations");
        try {
            if (saved && saved.startsWith('[')) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("JSON Parse Error in Home.js:", e);
        }
        return [];
    });

    const [activeOrg, setActiveOrg] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showForm, setShowForm] = useState(null);

    const [orgName, setOrgName] = useState("");
    const [createdOrg, setCreatedOrg] = useState(null);
    const [eventOpen, setEventOpen] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventPlace, setEventPlace] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [announcementOpen, setAnnouncementOpen] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [message, setMessage] = useState("");

    const generateCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleCreate = async () => {
        if (!orgName){
            return;
        }
        const res = await fetch("http://localhost:5000/organizations/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: orgName, userId }),
        });
        if (res.ok) {
            const newOrg = await res.json();
            const updated = [...organizations, newOrg];
            setOrganizations(updated);
            localStorage.setItem("organizations", JSON.stringify(updated));
            setActiveOrg(newOrg);
            setOrgName("");
            setShowForm(null);
            setDropdownOpen(false);
            setMessage(`Organization Created! Code: ${newOrg.code}`);
        }
    };


    const handleJoin = async () => {
        if (!joinCode){
            return;
        }
        const res = await fetch("http://localhost:5000/organizations/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: joinCode, userId }),
        });
        if (res.ok) {
            const joinedOrg = await res.json();
            const updated = [...organizations, joinedOrg];
            setOrganizations(updated);
            localStorage.setItem("organizations", JSON.stringify(updated));
            setActiveOrg(joinedOrg);
            setJoinCode("");
            setShowForm(null);
            setDropdownOpen(false);
            setMessage(`Successfully joined ${joinedOrg.name}!`);
        } else {
            const text = await res.text();
            setMessage(text);
        }
    };

    const handleEventCreate = async () => {
        console.log("Create event button clicked");

        const eventData = {
            event: eventName,
            date: eventDate,
            description: eventDescription,
            place: eventPlace,
            time: eventTime
        };

        try {
            const response = await fetch("http://localhost:5000/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(eventData)
            });

            const data = await response.json();
            console.log("Saved event:", data);
            setMessage("Event created successfully!");

            setEventName("");
            setEventDate("");
            setEventDescription("");
            setEventPlace("");
            setEventTime("");
            setEventOpen(false);
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

        const handleAnnouncementCreate = async () => {
            const announcementData = {
                title: announcementTitle,
                message: announcementMessage,
                organizer: "Flourish Team",
                createdBy: "Flourish User"
            };
        try {
            const response = await fetch("http://localhost:5000/announcements", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(announcementData)
            });

            const data = await response.json();
            console.log("Saved announcement:", data);
            setMessage("Announcement created successfully!");

            setAnnouncementTitle("");
            setAnnouncementMessage("");
            setAnnouncementOpen(false);
        } catch (error) {
            console.error("Error saving announcement:", error);
        }
    };

    return (
        <div style={{ height: "100vh", background: "white" }}>
            {/* Navbar */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 24px",
                borderBottom: "1px solid #ddd",
                position: "relative"
            }}>
                <h2 style={{ margin: 0 }}>Flourish</h2>

                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => { setDropdownOpen(!dropdownOpen); setShowForm(null); }}
                        style={{ padding: "8px 16px", fontSize: "14px", cursor: "pointer" }}
                    >
                        {activeOrg ? activeOrg.name : "Select Organization"} ▾
                    </button>

                    {dropdownOpen && (
                        <div style={{
                            position: "absolute",
                            right: 0,
                            top: "110%",
                            background: "white",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            minWidth: "220px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            zIndex: 100
                        }}>
                            {organizations.map(org => (
                                <div
                                    key={org._id}
                                    onClick={() => { setActiveOrg(org); setDropdownOpen(false); }}
                                    style={{
                                        padding: "10px 16px",
                                        cursor: "pointer",
                                        background: activeOrg?._id === org._id ? "#f0f0f0" : "white",
                                        fontWeight: activeOrg?._id === org._id ? "bold" : "normal"
                                    }}
                                >
                                    {org.name}
                                </div>
                            ))}

                            <hr style={{ margin: "4px 0" }} />

                            {showForm === "create" ? (
                                <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <input
                                        placeholder="Organization name"
                                        value={orgName}
                                        onChange={e => setOrgName(e.target.value)}
                                        style={{ padding: "6px", fontSize: "14px" }}
                                    />
                                    <button onClick={handleCreate}>Create</button>
                                    <button onClick={() => setShowForm(null)}>Cancel</button>
                                </div>
                            ) : showForm === "join" ? (
                                <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <input
                                        placeholder="Enter org code"
                                        value={joinCode}
                                        onChange={e => setJoinCode(e.target.value)}
                                        style={{ padding: "6px", fontSize: "14px" }}
                                    />
                                    {message && <p style={{ color: "red", fontSize: "12px", margin: 0 }}>{message}</p>}
                                    <button onClick={handleJoin}>Join</button>
                                    <button onClick={() => setShowForm(null)}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <div onClick={() => setShowForm("create")} style={{ padding: "10px 16px", cursor: "pointer", color: "#555" }}>
                                        + Create Organization
                                    </div>
                                    <div onClick={() => setShowForm("join")} style={{ padding: "10px 16px", cursor: "pointer", color: "#555" }}>
                                        + Join Organization
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Dashboard body */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "calc(100vh - 60px)",
                fontSize: "24px",
                gap: "20px"
            }}>
                {activeOrg ? (
                    <div style={{ textAlign: "center" }}>
                        <h2>Welcome to {activeOrg.name}</h2>
                        <p style={{ fontSize: "16px", color: "#666", marginTop: "-10px" }}>
                            Org Code: <strong style={{ color: "#007bff" }}>{activeOrg.code}</strong>
                        </p>
                    </div>
                ) : (
                    <p>Create or join an organization to get started.</p>
                )}

                {message && <p style={{ color: "green", fontSize: "16px" }}>{message}</p>}

                <button
                    onClick={() => setEventOpen(!eventOpen)}
                    style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                >
                    Create Event ▾
                </button>

                {eventOpen && (
                    <div style={{
                        background: "#f5f5f5",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "15px",
                        width: "300px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}>
                        <input type="text" placeholder="Event name" value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                        <input type="text" placeholder="Date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                        <input type="text" placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                        <input type="text" placeholder="Place" value={eventPlace} onChange={(e) => setEventPlace(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                        <input type="text" placeholder="Time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                        <button onClick={handleEventCreate}>Create</button>
                    </div>
                )}

                <button
                    onClick={() => setAnnouncementOpen(!announcementOpen)}
                    style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                >
                    Create Announcement ▾
                </button>

                {announcementOpen && (
                    <div style={{
                        background: "#f5f5f5",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "15px",
                        width: "300px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                    }}>
                        <input type="text" placeholder="Announcement title" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                        <input type="text" placeholder="Announcement message" value={announcementMessage} onChange={(e) => setAnnouncementMessage(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                        <button onClick={handleAnnouncementCreate}>Create</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;