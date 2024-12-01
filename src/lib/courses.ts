export interface Course {
  id: number
  title: string
  author: string
  platform: string
  description?: string
  image: string
  link: string
  rating: number
  learners: number
}

export const courses: Course[] = [
  {
    id: 1,
    title: "Accelerated Student Memory Mastery",
    author: "Dr. Rama Mehta",
    platform: "Udemy",
    description: "Memory Mastery, Memory Retention, Enhancing Self-Esteem & Confidence",
    image: "https://img-b.udemycdn.com/course/240x135/3695326_2d39_3.jpg",
    link: "https://www.udemy.com/course/accelerated-student-memory-mastery/learn/lecture/23763580?start=0#overview",
    rating: 4.5,
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
    learners: 1654
  },
  {
    id: 5,
    title: "Stanford CS224N: NLP with Deep Learning | Winter 2021",
    author: "Prof. Manning",
    platform: "YouTube",
    image: "https://i.ytimg.com/vi/rmVRLeJRkl4/hqdefault.jpg",
    link: "https://www.youtube.com/embed/rmVRLeJRkl4",
    rating: 2.5,
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
    learners: 200
  },
  {
    id: 7,
    title: "Arduino",
    author: "Free Code Camp",
    platform: "Youtube",
    image: "https://i.ytimg.com/vi/zJ-LqeX_fLU/hqdefault.jpg",
    link: "https://www.youtube.com/embed/zJ-LqeX_fLU",
    rating: 3.8,
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
    learners: 4
  },
  {
    id: 11,
    title: "Artificial Intelligence",
    author: "Edureka",
    platform: "Youtube",
    image: "https://img.youtube.com/vi/JMUxmLyrhSk/hqdefault.jpg",
    link: "https://www.youtube.com/embed/JMUxmLyrhSk",
    rating: 3.2,
    learners: 45
  },
  // Add more course objects here
];