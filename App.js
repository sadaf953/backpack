const urlParams = new URLSearchParams(window.location.search);
const courseId = urlParams.get('id');
const courses = [
    {
        id: 1,
        title: "Accelerated Student Memory Mastery",
        author: "Dr. Rama Mehta",
        platform: "Udemy",
        description: "Memory Mastery, Memory Retention, Enhancing Self-Esteem & Confidence",
        image: "https://img-b.udemycdn.com/course/240x135/3695326_2d39_3.jpg",
        link: "https://www.udemy.com/course/accelerated-student-memory-mastery/learn/lecture/23763580?start=0#overview",
        rating: 4.5,
        price:"Free",
        learners: 1000
    },
    {
        id: 2,
        title: "Arduino",
        author: "Free Code Camp",
        platform: "Youtube",
        description: "Learn Python - Full Course for Beginners [Tutorial]",
        image: "https://i.ytimg.com/vi/zJ-LqeX_fLU/hqdefault.jpg",
        link: "https://www.youtube.com/embed/rfscVS0vtbw",
        rating: 3.5,
        price:"Free",
        learners: 1654
    },
    {
        id: 3,
        title: "Machine Learning with Python",
        author: "Free Code Camp",
        platform: "Free Code Camp",
        description: "TensorFlow framework is used to build several neural networks and explore more advanced techniques like natural language processing and reinforcement learning.",
        image: "https://i.ytimg.com/vi/tPYj3fFJGjk/hqdefault.jpg",
        link: "https://www.freecodecamp.org/learn/machine-learning-with-python/",
        rating: 3.5,
        price:"Free",
        learners: 1654
    },

    {
        id: 4,
        title: "Introduction to Large Language Models",
        author: "Free Code Camp",
        platform: "Youtube",
        description: "Learn Python - Full Course for Beginners [Tutorial]",
        image: "https://cdn.qwiklabs.com/xObBJc2NLmPNIX735GDMYOeZvwM5Qps3cy%2F3%2Fr8no%2Bk%3D",
        link: "https://www.cloudskillsboost.google/paths/118/course_templates/539",
        rating: 2.5,
        price:"Free",
        learners: 1654
    },

    {
    id: 5,
    title: "Stanford CS224N: NLP with Deep Learning | Winter 2021",
    author: "Prof. Manning",
    platform: "YouTube",
    image:"https://i.ytimg.com/vi/rmVRLeJRkl4/hqdefault.jpg",
    link: "https://www.youtube.com/embed/rmVRLeJRkl4", 
    rating: 2.5,
    price:"Free",
    learners: 1654

},

{
    id: 6,
    title: "Python",
    author: "Free Code Camp",
    platform: "Youtube",
    image: "https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg",
    link: "https://www.youtube.com/embed/rfscVS0vtbw",
    rating: 5.0,
    price:"Free",
    learners: 200
  },
  {
    id: 7,
    title: "Ardino",
    author: "Free Code Camp",
    platform: "Youtube",
    image: "https://i.ytimg.com/vi/zJ-LqeX_fLU/hqdefault.jpg",
    link: "https://www.youtube.com/embed/zJ-LqeX_fLU",
    rating: 3.8,
    price:"Free",
    learners: 4567
  },
  {
    id: 8,
    title: "Full Stack Web Development",
    author: "Simplilearn",
    platform: "Youtube",
    image: "https://img.youtube.com/vi/R6RX2Zx96fE/hqdefault.jpg",
    link: "https://www.youtube.com/embed/R6RX2Zx96fE",
    rating: 3.5,
    price:"Free",
    learners: 236
  },
  {
    id: 9,
    title: "2D Animation",
    author: "Technical Dhuriya Analysis",
    platform: "Youtube",
    image: "https://img.youtube.com/vi/XmckF29tqGs/hqdefault.jpg",
    link: "https://www.youtube.com/embed/XmckF29tqGs",
    rating: 1.2,
    price:"Free",
    learners: 24
  },
  {
    id: 10,
    title: "Machine Learning Course",
    author: "Stanford Online",
    platform: "Youtube",
    image: "https://img.youtube.com/vi/jGwO_UgTS7I/hqdefault.jpg",
    link: "https://www.youtube.com/embed/jGwO_UgTS7I",
    rating: 4.5,
    price:"Free",
    learners: 4
  },
  {
    id:11,
    title: "Artificial Intelligence",
    author: "Edureka",
    platform: "Youtube",
    image: "https://img.youtube.com/vi/JMUxmLyrhSk/hqdefault.jpg",
    link: "https://www.youtube.com/embed/JMUxmLyrhSk",
    rating: 3.2,
    price:"Free",
    learners: 45
  },
  
]
// Find the course with the provided ID
const course = courses.find(course => course.id === parseInt(courseId));

// Display course details
const courseDetailsContainer = document.getElementById('course-details');
if (course) {
    courseDetailsContainer.innerHTML = `
    <div class="container">
    <div class="box">
        <h2 class="card-title">${course.title}</h2>
        <div class="details">
            <div class="content">
                <p class="author">${course.author}
                    <span class="platform">| ${course.platform}</span>
                </p>
                <p class="description">${course.description}</p>
            </div>
        </div>
        <div class="image">
                <img src="${course.image}" alt="${course.title}" width="335" height="185">
            </div>
    <div class="stats">
                <div class="price">
                    <svg  xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="black" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                        <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z"/>
                    </svg><spam>${course.price}/-</spam></div>
                <div class="rating">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="black" class="bi bi-star-fill" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    <spam>${course.rating} Ratings </spam>
                </div>
                <div class="learners">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="black" class="bi bi-people-fill" viewBox="0 0 16 16">
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                    </svg>
                    <spam>${course.learners} Learners</spam>

                </div> 
                <p><button class="enroll-button" onclick="window.open('${course.link}', '_blank');" rel="noopener noreferrer">Enroll Now</button></p>
                </div>
                
    `;
} else {
    courseDetailsContainer.innerHTML = `<p>Course not found</p>`;
}
