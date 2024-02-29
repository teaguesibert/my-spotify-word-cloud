# Lyric-Cloud

## Introduction

Lyric-Cloud is an application that analyzes the most frequently used words from your top 20 Spotify tracks' lyrics and generates a word cloud. This app provides a unique way to visualize underlying themes of your favorite music.

A deployed URL can be found here below, but currently requires email whitelisting until Spotify approves the application:

**https://lyric-cloud.vercel.app/**

## Features

- **Word Cloud Generation:** Automatically creates a word cloud from the lyrics of your top Spotify tracks.
- **Spotify Integration:** Seamlessly connects with your Spotify account to access your top tracks.
- **Advanced Text Analysis:** Utilizes NLP (Natural Language Processing) from the compromise library to parse lyrics.
- **Themes:** Currently offers a light and dark theme.
- **Responsive Design:** Ensures a smooth user experience across various devices, though it is designed for mobile use.

## How It Works

1. **Connect Spotify:** Log in with your Spotify account to allow Lyric-Cloud to access your top tracks.
2. **Lyric Analysis:** The app uses NLP to extract key words from the lyrics of these tracks.
3. **Word Cloud Creation:** Utilizes d3-cloud to generate a visually appealing word cloud.
4. **Display and Customize:** View and customize your personal word cloud.

## Screenshots

1. **Sign in:**
   ![Sign in]("https://raw.githubusercontent.com/teaguesibert/spotify-lyric-cloud/master/public/lyric-signin.png")

2. **Sample Word Cloud:**
   ![Sample Word Cloud](path-to-your-image)

3. **Word Cloud controls and Top Tracks**
   ![Top Tracks](path-to-your-image)

## Technologies Used

- **Next.js:** A React framework for building user interfaces.
- **d3-cloud:** A JavaScript library for producing word cloud layouts.
- **Compromise (NLP):** A natural language processing library for extracting insights from text.

## Installation

1. Clone the repository: git clone https://github.com/your-repo/Lyric-Cloud.git
2. Install dependencies: npm install
3. Run the application: npm run dev

## Usage

After installation, set up your .env file with the appropriate variables, and open your web browser and navigate to `http://localhost:3000`. Log in with your Spotify account to start generating your personalized word cloud.

## Contributing

Contributions to Lyric-Cloud are welcome! Please refer to the contribution guidelines for more information.


## Contact

For support or queries, please reach out to teaguesibert@gmail.com.
