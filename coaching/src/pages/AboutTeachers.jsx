import React, { useEffect, useState } from "react";
import teacherPhoto from "../assets/Sudhanshu Shekhar.png";
import shashiPhoto from "../assets/Shashi Kumar.jpeg";
import amitPhoto from "../assets/Amit Sharma.jpeg";
import nagendraPhoto from "../assets/Nagendra Kumar.jpeg";
import vaishaliPhoto from "../assets/Vaishali Sharma.jpeg";

const teachers = [
	{
		name: "Sudhanshu Shekhar",
		subject: "Mathematics Director",
		bio: "30+ years of math mentorship • Author • Board paper setter • IIT Kharagpur alumnus.",
		image: teacherPhoto,
		color: "#c084fc"
	},
	{
		name: "Shashi Kumar",
		subject: "Physics Lead",
		bio: "20+ years mapping kinematics to modern experiments.",
		image: shashiPhoto,
		color: "#38bdf8"
	},
	{
		name: "Amit Sharma",
		subject: "Accounts & Commerce",
		bio: "Chartered Accountant guiding commerce toppers for 15+ years.",
		image: amitPhoto,
		color: "#fbbf24"
	},
	{
		name: "Nagendra Kumar",
		subject: "Chemistry Coach",
		bio: "Lab-first pedagogy with 7+ years of NEET/JEE batches.",
		image: nagendraPhoto,
		color: "#34d399"
	},
	{
		name: "Vaishali Sharma",
		subject: "English & SST",
		bio: "Story-driven humanities mentor, 5+ years.",
		image: vaishaliPhoto,
		color: "#f472b6"
	}
];

const teachingValues = [
	"Diagnostics → Remedy → Re-test",
	"Motion-first classrooms",
	"Socratic doubt clearing",
	"Parent briefings"
];

const AboutTeachers = () => {
	const [isMobile, setIsMobile] = useState(typeof window === "undefined" ? true : window.innerWidth <= 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (typeof document === "undefined") {
			return;
		}
		const fontId = "teachers-page-fonts";
		if (document.getElementById(fontId)) {
			return;
		}
		const link = document.createElement("link");
		link.id = fontId;
		link.rel = "stylesheet";
		link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Space+Grotesk:wght@400;500;600&display=swap";
		document.head.appendChild(link);
	}, []);

	const leadMentor = teachers[0];
	const teamMembers = teachers.slice(1);

	return (
		<div
			style={{
				minHeight: "calc(100vh - 160px)",
				backgroundImage:
					"radial-gradient(circle at 10% 20%, rgba(255,255,255,0.15), transparent 35%), " +
					"linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #4c1d95 100%)",
				padding: isMobile ? "2rem 1rem 3rem" : "3rem 2rem 4rem",
				fontFamily: "'Space Grotesk', 'Trebuchet MS', sans-serif",
				color: "#f8fafc"
			}}
		>
			<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
				{/* Hero */}
				<section
					style={{
						display: "grid",
						gridTemplateColumns: isMobile ? "1fr" : "minmax(0,0.9fr) minmax(0,1.1fr)",
						gap: isMobile ? "1.5rem" : "2.5rem",
						marginBottom: "3rem"
					}}
				>
					<div
						style={{
							background: "rgba(15,23,42,0.6)",
							borderRadius: "28px",
							padding: isMobile ? "1.75rem" : "2.5rem",
							border: "1px solid rgba(255,255,255,0.15)",
							boxShadow: "0 35px 70px rgba(15,23,42,0.4)",
							backdropFilter: "blur(14px)"
						}}
					>
						<p style={{ letterSpacing: "0.28em", textTransform: "uppercase", fontSize: "0.75rem", color: "#a5b4fc" }}>Faculty Collective</p>
						<h1
							style={{
								fontFamily: "'Playfair Display', 'Georgia', serif",
								fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
								margin: "0.7rem 0 1rem",
								lineHeight: 1.2
							}}
						>
							Humans first, teachers forever.
						</h1>
						<p style={{ color: "rgba(248,250,252,0.85)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
							Each mentor blends deep subject expertise with studio-style feedback loops so every learner feels seen, supported, and stretched.
						</p>

						<div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
							{teachingValues.map((value) => (
								<span
									key={value}
									style={{
										padding: "0.35rem 0.8rem",
										borderRadius: "999px",
										border: "1px solid rgba(255,255,255,0.25)",
										background: "rgba(255,255,255,0.08)",
										fontSize: "0.85rem"
									}}
								>
									{value}
								</span>
							))}
						</div>
					</div>

					<div
						style={{
							borderRadius: "30px",
							padding: isMobile ? "1.5rem" : "2.3rem",
							background: "linear-gradient(160deg, #f8fafc 0%, #e0e7ff 60%, #c7d2fe 100%)",
							color: "#0f172a",
							boxShadow: "0 35px 70px rgba(15,23,42,0.25)"
						}}
					>
						<div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1.5rem", alignItems: "center" }}>
							<img
								src={leadMentor.image}
								alt={leadMentor.name}
								style={{
									width: isMobile ? "140px" : "170px",
									height: isMobile ? "140px" : "170px",
									borderRadius: "24px",
									objectFit: "cover",
									border: `4px solid ${leadMentor.color}`
								}}
							/>
							<div>
								<p style={{ letterSpacing: "0.35em", textTransform: "uppercase", fontSize: "0.75rem", color: "#6366f1", margin: 0 }}>
									Academic Director
								</p>
								<h2 style={{ margin: "0.3rem 0", fontSize: "1.8rem", fontFamily: "'Playfair Display', 'Georgia', serif" }}>{leadMentor.name}</h2>
								<p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{leadMentor.bio}</p>
							</div>
						</div>
					</div>
				</section>

				{/* Team Grid */}
				<section style={{ marginBottom: "3rem" }}>
					<h3
						style={{
							textAlign: "center",
							fontFamily: "'Playfair Display', 'Georgia', serif",
							fontSize: "clamp(1.7rem,4vw,2.5rem)",
							marginBottom: "1.8rem"
						}}
					>
						Meet the studio leads
					</h3>
					<div
						style={{
							display: "grid",
							gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
							gap: "1.2rem"
						}}
					>
						{teamMembers.map((teacher) => (
							<div
								key={teacher.name}
								style={{
									borderRadius: "24px",
									padding: "1.5rem",
									background: "rgba(255,255,255,0.08)",
									border: "1px solid rgba(255,255,255,0.2)",
									boxShadow: "0 25px 45px rgba(15,23,42,0.35)",
									backdropFilter: "blur(12px)",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									textAlign: "center"
								}}
							>
								<div
									style={{
										width: "120px",
										height: "120px",
										borderRadius: "50%",
										overflow: "hidden",
										border: `3px solid ${teacher.color}`,
										marginBottom: "1rem"
									}}
								>
									<img src={teacher.image} alt={teacher.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
								</div>
								<h4 style={{ margin: 0, fontSize: "1.25rem" }}>{teacher.name}</h4>
								<p style={{ margin: "0.3rem 0", color: teacher.color, fontWeight: 600 }}>{teacher.subject}</p>
								<p style={{ margin: 0, color: "rgba(248,250,252,0.85)", lineHeight: 1.6 }}>{teacher.bio}</p>
							</div>
						))}
					</div>
				</section>

				{/* Ethos */}
				<section
					style={{
						borderRadius: "30px",
						padding: isMobile ? "2rem" : "2.6rem",
						background: "linear-gradient(135deg, #fda4af, #fb7185, #f472b6)",
						color: "#0f172a",
						boxShadow: "0 35px 60px rgba(0,0,0,0.25)"
					}}
				>
					<div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: "1.5rem", alignItems: "center" }}>
						<div>
							<p style={{ letterSpacing: "0.3em", textTransform: "uppercase", fontSize: "0.75rem", margin: 0 }}>Faculty promise</p>
							<h3 style={{ margin: "0.5rem 0", fontSize: "1.9rem", fontFamily: "'Playfair Display', 'Georgia', serif" }}>
								We design every lesson to be a conversation, not a monologue.
							</h3>
							<p style={{ margin: 0, lineHeight: 1.8, color: "#1f2937" }}>
								Doubts are logged, milestones are celebrated, and recoveries are planned with empathy. That’s how toppers and late bloomers share the same room with confidence.
							</p>
						</div>
						<div
							style={{
								borderRadius: "20px",
								padding: "1.2rem 1.4rem",
								background: "rgba(255,255,255,0.85)",
								border: "1px solid rgba(15,23,42,0.08)",
								color: "#0f172a"
							}}
						>
							<p style={{ margin: 0, fontWeight: 600 }}>Office Hours</p>
							<p style={{ margin: "0.3rem 0 0", color: "#475569" }}>Mon–Sat · 3 PM – 8 PM</p>
							<p style={{ margin: "0.3rem 0 0", color: "#475569" }}>Dedicated Sunday bootcamps before boards.</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
};

export default AboutTeachers;
