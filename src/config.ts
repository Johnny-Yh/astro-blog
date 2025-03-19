export const SITE = {
  website: "https://blog.beyh.net/", // replace this with your deployed domain
  author: "Johnny",
  profile: "https://beyh.net/",
  desc: "A simple blog.",
  title: "Johnny's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 3,
  postPerPage: 5,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  // editPost: {
  //   url: "https://github.com/Johnny-Yh/astro-blog/edit/main/src/data/blog",
  //   text: "Suggest Changes",
  //   appendFilePath: true,
  // },
  dynamicOgImage: true,
} as const;
