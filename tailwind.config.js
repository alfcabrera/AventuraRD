/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
	presets: [require("nativewind/preset")],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: "#2F9E62",
				"primary-dark": "#237A4B",
				"primary-light": "#E8F5EE",
				secondary: "#1A6B9A",
				accent: "#F4A024",
				background: "#F8FAF9",
				card: "#FFFFFF",
				"text-primary": "#1A1A2E",
				"text-secondary": "#6B7280",
				"text-muted": "#9CA3AF",
				border: "#E5E7EB",
				danger: "#EF4444",
				success: "#10B981",
			},
			fontFamily: {
				sans: ["Poppins_400Regular"],
				medium: ["Poppins_500Medium"],
				semibold: ["Poppins_600SemiBold"],
				bold: ["Poppins_700Bold"],
			},
			borderRadius: {
				"2xl": "16px",
				"3xl": "24px",
			},
		},
	},
	plugins: [],
};
