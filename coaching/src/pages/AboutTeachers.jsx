import React, { useState, useEffect } from "react";
import teacherPhoto from "../assets/Sudhanshu Shekhar.png";

const teachers = [
	{
		name: "Sudhanshu Shekhar",
		subject: "Mathematics",
		bio: "PhD in Mathematics, 16+ years of teaching experience.",
		image: teacherPhoto,
	},
	{
		name: "Ms. R. Verma",
		subject: "Physics",
		bio: "MSc in Physics,7 years of teaching experience.",
		image: "https://randomuser.me/api/portraits/women/44.jpg",
	},
	{
		name: "Mr. S. Gupta",
		subject: "Chemistry",
		bio: "MSc in Chemistry, 8 years of experience in coaching.",
		image: "https://randomuser.me/api/portraits/men/65.jpg",
	},
	{
		name: "Ms. P. Mehra",
		subject: "Biology",
		bio: "MSc in Biology, 7 years of teaching experience.",
		image: "https://randomuser.me/api/portraits/women/68.jpg",
	},
	{
		name: "Mr. V. Singh",
		subject: "English",
		bio: "MA in English, 9 years of experience in coaching.",
		image: "https://randomuser.me/api/portraits/men/77.jpg",
	},
];

const cardStyle = {
	borderRadius: "16px",
	padding: "2rem 1.5rem",
	boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
	textAlign: "center",
	background: "#fff",
	transition: "all 0.3s",
	borderTop: "4px solid #667eea",
	width: "100%",
	boxSizing: "border-box"
};

const AboutTeachers = () => {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const rowStyle = {
		display: "grid",
		gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
		gap: isMobile ? "1.5rem" : "2rem",
		marginTop: "2rem",
		maxWidth: "700px",
		margin: "2rem auto 0",
		width: "100%"
	};

	return (
		<div style={{
			minHeight: "calc(100vh - 160px)",
			background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
			paddingTop: "2rem",
			paddingBottom: "2rem",
			paddingLeft: isMobile ? "1rem" : "2rem",
			paddingRight: isMobile ? "1rem" : "2rem",
			width: "100%",
			overflowX: "hidden"
		}}>
			<div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
				<h2 style={{ 
					textAlign: "center", 
					color: "#fff", 
					fontSize: isMobile ? "2rem" : "2.5rem",
					marginBottom: "3rem",
					textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
					fontWeight: "700"
				}}>About Our Teachers</h2>
		
		<div style={{ ...cardStyle, margin: "0 auto 3rem auto", maxWidth: "350px", borderTop: "4px solid #764ba2" }}
			onMouseOver={(e) => {
				e.currentTarget.style.transform = "translateY(-10px)";
				e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
			}}
			onMouseOut={(e) => {
				e.currentTarget.style.transform = "translateY(0)";
				e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
			}}>
			<img
				src={teachers[0].image}
				alt={teachers[0].name}
				style={{
					width: "120px",
					height: "120px",
					borderRadius: "50%",
					objectFit: "cover",
					marginBottom: "1rem",
					border: "4px solid #764ba2"
				}}
			/>
			<h3 style={{ color: "#333", fontSize: "1.4rem", marginBottom: "0.5rem" }}>{teachers[0].name}</h3>
			<p style={{ 
				color: "#764ba2", 
				fontWeight: "600",
				fontSize: "1.1rem",
				marginBottom: "0.5rem"
			}}>
				{teachers[0].subject}
			</p>
			<p style={{ color: "#666", lineHeight: "1.6" }}>{teachers[0].bio}</p>
		</div>
		<h3
			style={{
				textAlign: "center",
				color: "#fff",
				fontSize: "2rem",
				marginBottom: "2rem",
				textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
			}}
		>
			Our Team
		</h3>
		<div style={rowStyle}>
			{teachers.slice(1).map((teacher, idx) => (
				<div key={idx} style={{ ...cardStyle, margin: 0 }}
					onMouseOver={(e) => {
						e.currentTarget.style.transform = "translateY(-10px)";
						e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.transform = "translateY(0)";
						e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.2)";
					}}>
					<img
						src={teacher.image}
						alt={teacher.name}
						style={{
							width: "120px",
							height: "120px",
							borderRadius: "50%",
							objectFit: "cover",
							marginBottom: "1rem",
							border: "4px solid #667eea"
						}}
					/>
					<h3 style={{ color: "#333", fontSize: "1.3rem", marginBottom: "0.5rem" }}>{teacher.name}</h3>
					<p style={{ 
						color: "#667eea", 
						fontWeight: "600",
						fontSize: "1rem",
						marginBottom: "0.5rem"
					}}>
						{teacher.subject}
					</p>
					<p style={{ color: "#666", lineHeight: "1.6" }}>{teacher.bio}</p>
				</div>
			))}
		</div>
			</div>
		</div>
	);
};

export default AboutTeachers;
