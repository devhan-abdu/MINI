export default ({ config }) => {
  const profile = process.env.EAS_BUILD_PROFILE;

  let androidPackage = "com.devhananabdu.mini";
  let appName = "Mini App";

  if (profile === "development") {
    androidPackage = "com.devhananabdu.mini.dev";
    appName = "Mini App Dev";
  }

  if (profile === "preview") {
    androidPackage = "com.devhananabdu.mini.preview";
    appName = "Mini App Preview";
  }

  return {
    ...config,
    name: appName,
    android: {
      package: androidPackage,
    },
  };
};
