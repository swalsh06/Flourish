import { useState, useEffect } from "react";

function Home() {
    const [joinOpen, setJoinOpen] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [joinName, setJoinName] = useState("");

    //const [orgSelectOpen, setOrgSelectOpen] = useState(false);
    //const [open, setOpen] = useState(false);

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
    const isOwner = activeOrg?.owner === userId || activeOrg?.owner?._id === userId;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showForm, setShowForm] = useState(null);
    const [orgName, setOrgName] = useState("");
    const [showMembers, setShowMembers] = useState(false);
    const [createOrgError, setCreateOrgError] = useState("");
    const [confirmAdmin, setConfirmAdmin] = useState(null);
    const isAdmin = activeOrg?.admins?.some(a => a._id === userId || a === userId);
    
    // Events state
    const [eventOpen, setEventOpen] = useState(false);
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventPlace, setEventPlace] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [events, setEvents] = useState([]);
    const [rsvpPopupEvent, setRsvpPopupEvent] = useState(null);

    // Announcements state
    const [announcementOpen, setAnnouncementOpen] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState("");
    const [announcementMessage, setAnnouncementMessage] = useState("");
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
    if (!activeOrg) return;

    const fetchOrgData = async () => {
        try {
            const [eventsRes, announcementsRes] = await Promise.all([
                fetch(`http://localhost:5000/organizations/${activeOrg._id}/events`),
                fetch(`http://localhost:5000/organizations/${activeOrg._id}/announcements`)
            ]);
            if (eventsRes.ok) setEvents(await eventsRes.json());
            if (announcementsRes.ok) setAnnouncements(await announcementsRes.json());
        } catch (err) {
            console.error("Error fetching org data:", err);
        }
    };

    fetchOrgData();
}, [activeOrg]);



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
        } else {
            const text = await res.text();
            setCreateOrgError(text);
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
        } else {
            const text = await res.text();
            setCreateOrgError(text);
        }
    };

    const handlePromoteAdmin = async (member) => {
        const res = await fetch(`http://localhost:5000/organizations/${activeOrg._id}/admins`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: member._id }),
        });
        if (res.ok) {
            const updatedOrg = await res.json();
            setActiveOrg(updatedOrg);
            const updatedOrgs = organizations.map(o => o._id === updatedOrg._id ? updatedOrg : o);
            setOrganizations(updatedOrgs);
            localStorage.setItem("organizations", JSON.stringify(updatedOrgs));
            setConfirmAdmin(null);
        }
    };

    const handleEventCreate = async () => {
        try {
            const response = await fetch("http://localhost:5000/events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: eventName,
                    date: eventDate,
                    description: eventDescription,
                    place: eventPlace,
                    time: eventTime,
                    organizationId: activeOrg._id
                })
            });

            if (response.ok) {
                const newEvent = await response.json();
                setEvents(prev => [...prev, newEvent]);
                setEventName(""); setEventDate(""); setEventDescription("");
                setEventPlace(""); setEventTime("");
                setEventOpen(false);
            }
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

        const handleRsvp = async (eventId, response) => {
            try {
                const res = await fetch(`http://localhost:5000/events/${eventId}/rsvp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, response })
                });
                if (res.ok) {
                    const updatedEvent = await res.json();
                    setEvents(prev => prev.map(ev => ev._id === eventId ? updatedEvent : ev));
                }
            } catch (error) {
                console.error("Error submitting RSVP:", error);
            }
        };

        const getUserRsvp = (ev) => {
            if (ev.rsvpYes?.some(u => u._id === userId || u === userId)) return "yes";
            if (ev.rsvpNo?.some(u => u._id === userId || u === userId)) return "no";
            return null;
        };

        const handleAnnouncementCreate = async () => {
            try {
                const response = await fetch("http://localhost:5000/announcements", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: announcementTitle,
                        message: announcementMessage,
                        createdBy: userId,
                        organizationId: activeOrg._id
                    })
                });

                if (response.ok) {
                    const newAnnouncement = await response.json();
                    setAnnouncements(prev => [...prev, newAnnouncement]);
                    setAnnouncementTitle("");
                    setAnnouncementMessage("");
                    setAnnouncementOpen(false);
                }
            } catch (error) {
                console.error("Error saving announcement:", error);
            }
        };

    return (
        <div style={{ minHeight: "100vh", background: "#C2D9C5" }}>
            {/* Navbar */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 24px",
                height: "100px",
                position: "relative",
            }}>
                <h2 className="title">Flourish</h2>

                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    

                    <button
                        onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }}
                    style={{
                        padding: "10px 20px",
                        fontSize: "14px",
                        cursor: "pointer",
                        borderRadius: "2px",
                        border: "1px solid #888",
                        background: "#eaeaea"        
                        }}
                    >
                    Logout
                    </button>

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
                                    {createOrgError && (
                                        <p style={{ color: "red", fontSize: "12px", margin: 0 }}>{createOrgError}</p>
                                    )}
                                    <button onClick={handleCreate}>Create</button>
                                    <button onClick={() => { setShowForm(null); setCreateOrgError(""); }}>Cancel</button>
                                </div>
                            ) : showForm === "join" ? (
                                <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <input
                                        placeholder="Enter org code"
                                        value={joinCode}
                                        onChange={e => setJoinCode(e.target.value)}
                                        style={{ padding: "6px", fontSize: "14px" }}
                                    />
                                    {createOrgError && <p style={{ color: "red", fontSize: "12px", margin: 0 }}>{createOrgError}</p>}
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

        </div>
                
                

            {/* Dashboard body */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: "auto",
                padding: "0 25px 10px 25px",
                background: "#C2D9C5"
            }}>

            {/* organization header */}
            {activeOrg && (
                <div style={{
                    background: "#f4f4f4",
                    display: "flex",
                    borderRadius: "6px",
                    gap: "10px",
                    padding: "12px 20px",
                    marginBottom: "5px",
                    alignItems: "center"
                }}>
                    
                    <span style={{ fontWeight: "500" }}>
                        {activeOrg.name}
                    </span>

                    {isOwner && (
                        <div style={{ marginLeft: "auto", position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
                            
                            {/* Org Code */}
                            <span style={{ 
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "#222"
                            }}>
                            {activeOrg.code}
                            </span>

                            <button
                                onClick={() => setShowMembers(!showMembers)}
                                style={{ padding: "6px 14px", fontSize: "13px", cursor: "pointer" }}
                            >
                                View Members
                            </button>
                            {showMembers && (
                                <div style={{
                                    position: "absolute",
                                    right: 0,
                                    top: "110%",
                                    background: "white",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    minWidth: "180px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    zIndex: 100,
                                    padding: "8px 0"
                                }}>
                                    <div style={{ padding: "8px 16px", fontWeight: "bold", fontSize: "13px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        Members
                                        <span onClick={() => setShowMembers(false)} style={{ cursor: "pointer", color: "#888", fontWeight: "normal" }}>✕</span>
                                    </div>
                                   {activeOrg.members.length === 0 ? (
                                        <div style={{ padding: "10px 16px", fontSize: "13px", color: "#888" }}>No members yet</div>
                                    ) : (
                                        activeOrg.members.map(m => {
                                            const memberIsAdmin = activeOrg.admins?.some(a => a._id === m._id);
                                            return (
                                                <div key={m._id || m} style={{ padding: "8px 16px", fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span>
                                                        {memberIsAdmin ? "⭐" : "👤"} {m.username || m}
                                                        {memberIsAdmin && <span style={{ fontSize: "11px", color: "green", marginLeft: "6px" }}>admin</span>}
                                                    </span>
                                                    {!memberIsAdmin && (
                                                        <span
                                                            onClick={() => setConfirmAdmin(m)}
                                                            style={{ cursor: "pointer", color: "#888", fontSize: "16px", marginLeft: "8px" }}
                                                            title="Promote to admin"
                                                        >+</span>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                    {/* Confirm admin popup */}
                                    {confirmAdmin && (
                                        <div style={{ padding: "10px 16px", borderTop: "1px solid #eee", fontSize: "13px" }}>
                                            <p style={{ margin: "0 0 8px 0" }}>Make <strong>{confirmAdmin.username}</strong> an admin?</p>
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button onClick={() => handlePromoteAdmin(confirmAdmin)} style={{ flex: 1, padding: "4px", cursor: "pointer", background: "#4caf50", color: "white", border: "none", borderRadius: "4px" }}>Yes</button>
                                                <button onClick={() => setConfirmAdmin(null)} style={{ flex: 1, padding: "4px", cursor: "pointer" }}>Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>  
            )}
            <div style={{
                maxWidth: "1400px",
                margin: "0 auto",
                width: "100%",
            }}>

            <div style={{
                display: "flex",
                gap: "30px",
                marginTop: "10px",
                alignItems: "flex-start"
            }}>
                <div style={{
                    flex: 1,
                    background: "#f6f4f4",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    padding: "25px",
                    borderRadius: "6px",
                    minHeight: "450px"
                }}> 
                    <div 
                        className="section-header" 
                        style={{ 
                        fontSize: "18px",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        marginBottom: "12px"
                        }}
                        >Events</div>
                        {(isOwner || isAdmin)&& (
                            <button
                                onClick={() => setEventOpen(!eventOpen)}
                                style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                            >
                                Create Event ▾
                            </button>
                        )}

                        <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            {events.length === 0 && (
                                <p style={{ color: "#888", fontSize: "14px" }}>No events yet.</p>
                            )}
                {events.map(ev => {
                    const userRsvp = getUserRsvp(ev);
                    return (
                        <div key={ev._id} style={{
                            background: "white", borderRadius: "8px",
                            padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                        }}>
                            <div style={{ fontWeight: "bold", fontSize: "17px" }}>{ev.event}</div>
                            <div style={{ fontSize: "13px", color: "#555", marginTop: "4px" }}>
                                📅 {new Date(ev.date).toLocaleDateString()} &nbsp;·&nbsp; 🕐 {ev.time}
                            </div>
                            <div style={{ fontSize: "13px", color: "#555" }}>📍 {ev.place}</div>
                            <div style={{ fontSize: "13px", marginTop: "6px" }}>{ev.description}</div>

                            {/* RSVP section — goes here, after description */}
                            {(isOwner || isAdmin) ? (
                                <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                                    <span style={{ fontSize: "13px", color: "#555" }}>
                                        ✅ {ev.rsvpYes?.length || 0} &nbsp; ❌ {ev.rsvpNo?.length || 0}
                                    </span>
                                    <button onClick={() => setRsvpPopupEvent(ev)}>
                                        View RSVPs
                                    </button>
                                </div>
                            ) : (
                                <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                                    <button
                                        onClick={() => handleRsvp(ev._id, "yes")}
                                        style={{
                                            padding: "5px 14px", fontSize: "13px", cursor: "pointer",
                                            borderRadius: "4px", border: "1px solid #ccc",
                                            background: userRsvp === "yes" ? "#4caf50" : "white",
                                            color: userRsvp === "yes" ? "white" : "#333",
                                        }}
                                    >
                                        ✅ Yes
                                    </button>
                                    <button
                                        onClick={() => handleRsvp(ev._id, "no")}
                                        style={{
                                            padding: "5px 14px", fontSize: "13px", cursor: "pointer",
                                            borderRadius: "4px", border: "1px solid #ccc",
                                            background: userRsvp === "no" ? "#e53935" : "white",
                                            color: userRsvp === "no" ? "white" : "#333",
                                        }}
                                    >
                                        ❌ No
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                        </div>

                        {eventOpen && (
                            <div style={{
                            background: "#f5f5f5",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "25px",
                            width: "300px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}>
                            <input type="text" placeholder="Event name" value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                            <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                            <input type="text" placeholder="Description" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                            <input type="text" placeholder="Place" value={eventPlace} onChange={(e) => setEventPlace(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                            <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} style={{ padding: "8px", fontSize: "14px" }} />
                            <button onClick={handleEventCreate}>Create</button>
                        </div>
                    )}
                    
                </div>

                     {/* announcement portion */}
                <div style={{
                    flex: 1,
                    background: "#f6f4f4",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    padding: "25px",
                    borderRadius: "6px",
                     minHeight: "450px"
                }}>
                    <div 
                        className="section-header" 
                        style={{ 
                        fontSize: "18px",
                        padding: "10px 14px",
                        borderRadius: "6px",
                        marginBottom: "12px"
                        }}
                        >Announcements</div>
                        {(isOwner || isAdmin) && (
                            <button
                                onClick={() => setAnnouncementOpen(!announcementOpen)}
                                style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
                            >
                                Create Announcement ▾
                            </button>
                        )}

                {announcementOpen && (
                    <div style={{
                        background: "#f5f5f5",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "25px",
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
                    <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        {announcements.length === 0 && (
                            <p style={{ color: "#888", fontSize: "14px" }}>No announcements yet.</p>
                        )}
                        {announcements.map(ann => (
                            <div key={ann._id} style={{
                                background: "white", borderRadius: "8px",
                                padding: "16px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                            }}>
                                <div style={{ fontWeight: "bold", fontSize: "17px" }}>{ann.title}</div>
                                <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>
                                    {new Date(ann.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ fontSize: "13px", marginTop: "6px" }}>{ann.message}</div>
                            </div>
                        ))}
                    </div>
                </div>  {/* closes announcements panel */}

        </div>  {/* closes flex row */}

</div>  {/* closes maxWidth wrapper */}
</div>  
    {/* RSVP Popup */}
    {rsvpPopupEvent && (
        <div onClick={() => setRsvpPopupEvent(null)} style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 200
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                background: "white", borderRadius: "10px",
                padding: "28px", minWidth: "320px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.18)"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ margin: 0 }}>{rsvpPopupEvent.event} — RSVPs</h3>
                    <span onClick={() => setRsvpPopupEvent(null)} style={{ cursor: "pointer", color: "#888", fontSize: "20px" }}>✕</span>
                </div>
                <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", color: "#4caf50", marginBottom: "8px" }}>✅ Going ({rsvpPopupEvent.rsvpYes?.length || 0})</div>
                        {rsvpPopupEvent.rsvpYes?.map(u => <div key={u._id} style={{ fontSize: "13px", padding: "4px 0" }}>👤 {u.username}</div>)}
                    </div>
                    <div style={{ width: "1px", background: "#eee" }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", color: "#e53935", marginBottom: "8px" }}>❌ Not Going ({rsvpPopupEvent.rsvpNo?.length || 0})</div>
                        {rsvpPopupEvent.rsvpNo?.map(u => <div key={u._id} style={{ fontSize: "13px", padding: "4px 0" }}>👤 {u.username}</div>)}
                    </div>
                </div>
            </div>
        </div>
    )}      

</div>  


);
}

export default Home;