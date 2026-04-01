import { useState } from "react";

function Home() {
    const [joinOpen, setJoinOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joinName, setJoinName] = useState("");

    const [orgSelectOpen, setOrgSelectOpen] = useState(false);

    const [open, setOpen] = useState(false);
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

            <button
                onClick={() => setEventOpen(!eventOpen)}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer"
                }}
            >
                Create Event ▾
            </button>

            <button
                onClick={() => setAnnouncementOpen(!announcementOpen)}
                style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer"
                }}
            >
                Create Announcement ▾
            </button>

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

            {message && (
                <p style={{ marginTop: "10px", color: "green" }}>{message}</p>
            )}

            {eventOpen && (
                <div style={{
                    marginTop: "20px",
                    background: "#f5f5f5",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    width: "300px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                }}>
                    <input
                        type="text"
                        placeholder="Event name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        style={{ padding: "8px", fontSize: "14px" }}
                    />
                    <input
                        type="text"
                        placeholder="Date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        style={{ padding: "8px", fontSize: "14px" }}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        style={{ padding: "8px", fontSize: "14px" }}
                    />
                    <input
                        type="text"
                        placeholder="Place"
                        value={eventPlace}
                        onChange={(e) => setEventPlace(e.target.value)}
                        style={{ padding: "8px", fontSize: "14px" }}
                    />
                    <input
                        type="text"
                        placeholder="Time"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        style={{ padding: "8px", fontSize: "14px" }}
                    />

                    <button onClick={handleEventCreate}>Create</button>
                </div>
            )}

            {announcementOpen && (
                <div style={{
                    marginTop: "20px",
                    background: "#f5f5f5",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "15px",
                    width: "300px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px"
                }}>
                    <input
                        type="text"
                        placeholder="Announcement title"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        style={{ padding: "8px", fontSize: "14px" }}
                    />
                    <input
                        type="text"
                        placeholder="Announcement message"
                        value={announcementMessage}
                        onChange={(e) => setAnnouncementMessage(e.target.value)}
                        style={{ padding: "8px", fontSize: "14px" }}
                    />

                    <button onClick={handleAnnouncementCreate}>Create</button>
                </div>
            )}

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