import HomeNavigation from "../components/HomeNavigation";

function HomePage() {
  const DUMMY_DATA = [
    {
      courseId: "c1",
      courseName: "Course 1",
    },
    {
      courseId: "c2",
      courseName: "Course 2",
    },
    {
      courseId: "c3",
      courseName: "Course 3",
    },
  ];

  return (
    
    <div>
      <HomeNavigation coursesData={DUMMY_DATA} />
    </div>
  );
}

export default HomePage;
