import { prisma } from './prisma'

export interface Course {
  id?: string
  title: string
  author?: string
  platform: string
  description?: string
  image: string
  link: string
  price?: number
  createdBy?: {
    id?: string
    name?: string
  }
}

export interface CourseResult {
  success: boolean;
  course?: Course;
  error?: string;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "Accelerated Student Memory Mastery",
    author: "Dr. Rama Mehta",
    platform: "Udemy",
    description: "Memory Mastery, Memory Retention, Enhancing Self-Esteem & Confidence",
    image: "https://img-b.udemycdn.com/course/240x135/3695326_2d39_3.jpg",
    link: "https://www.udemy.com/course/accelerated-student-memory-mastery/learn/lecture/23763580?start=0#overview",
    
  },
  {
    id: "2",
    title: "Complete Python Bootcamp",
    author: "Jose Portilla",
    platform: "Udemy",
    description: "Learn Python Programming from Beginner to Advanced",
    image: "https://img-b.udemycdn.com/course/240x135/1565838_e54e_11.jpg",
    link: "https://www.udemy.com/course/complete-python-bootcamp/",
    
  },
  
  {
    id: "3",
    title: " Python Bootcamp",
    author: "Josephhhh Portilla",
    platform: "YouTube",
    description: "Learn calculus from Beginner to Advanced",
    image: "https://i.ytimg.com/vi/MDL384gsAk0/hqdefault.jpg",
    link: "https://www.youtube.com/watch?v=MDL384gsAk0&list=PLD80i8An1OEGZ2tYimemzwC3xqkU0jKUg&index=4/",
  },

  {
    id: "4",
    title: "Accelerated Student Memory Mastery",
    author: "Dr. Rama Mehta",
    platform: "Udemy",
    description: "Memory Mastery, Memory Retention, Enhancing Self-Esteem & Confidence",
    image: "https://img-b.udemycdn.com/course/240x135/3695326_2d39_3.jpg",
    link: "https://www.udemy.com/course/accelerated-student-memory-mastery/learn/lecture/23763580?start=0#overview",
  },

  {
  id: "5",
  title: "Arduino",
  author: "Free Code Camp",
  platform: "Youtube",
  description: "Learn Python - Full Course for Beginners [Tutorial]",
  image: "https://i.ytimg.com/vi/zJ-LqeX_fLU/hqdefault.jpg",
  link: "https://www.youtube.com/embed/rfscVS0vtbw",
  },

  {
    id: "6",
    title: "Machine Learning with Python",
    author: "Free Code Camp",
    platform: "Free Code Camp",
    description: "TensorFlow framework is used to build several neural networks and explore more advanced techniques like natural language processing and reinforcement learning.",
    image: "https://i.ytimg.com/vi/tPYj3fFJGjk/hqdefault.jpg",
    link: "https://www.freecodecamp.org/learn/machine-learning-with-python/",
    },
  {
    id: "7",
    title: "Introduction to Large Language Models",
    author: "Free Code Camp",
    platform: "Youtube",
    description: "Learn Python - Full Course for Beginners [Tutorial]",
    image: "https://cdn.qwiklabs.com/xObBJc2NLmPNIX735GDMYOeZvwM5Qps3cy%2F3%2Fr8no%2Bk%3D",
    link: "https://www.cloudskillsboost.google/paths/118/course_templates/539",
    },

  {
    id: "8",
    title: "Stanford CS224N: NLP with Deep Learning | Winter 2021",
    author: "Prof. Manning",
    platform: "YouTube",
    image:"https://i.ytimg.com/vi/rmVRLeJRkl4/hqdefault.jpg",
    link: "https://www.youtube.com/embed/rmVRLeJRkl4", 
  },

  {
    id: "9",
    title: "Python",
    author: "Free Code Camp",
    platform: "Youtube",
    image: "https://i.ytimg.com/vi/rfscVS0vtbw/hqdefault.jpg",
    link: "https://www.youtube.com/embed/rfscVS0vtbw",
    },

  {
    id: "10",
    title: "Ardino",
    author: "Free Code Camp",
    platform: "Youtube",
    image: "https://i.ytimg.com/vi/zJ-LqeX_fLU/hqdefault.jpg",
    link: "https://www.youtube.com/embed/zJ-LqeX_fLU",
    },
  
  {
    id:"11",
    title: "Full Stack Web Development",
    author: "Simplilearn",
    platform: "Youtube",
    image: "https://img.youtube.com/vi/R6RX2Zx96fE/hqdefault.jpg",
    link: "https://www.youtube.com/embed/R6RX2Zx96fE",
  },

  {
    id:"12",
    title: "2D Animation",
    author: "Technical Dhuriya Analysis",
    platform: "Youtube",
    image: "https://img.youtube.com/vi/XmckF29tqGs/hqdefault.jpg",
    link: "https://www.youtube.com/embed/XmckF29tqGs",
  },

  {
  id:"13",
  title: "Machine Learning Course",
  author: "Stanford Online",
  platform: "Youtube",
  image: "https://img.youtube.com/vi/jGwO_UgTS7I/hqdefault.jpg",
  link: "https://www.youtube.com/embed/jGwO_UgTS7I",
  },

  {
  id:"14",
  title: "Artificial Intelligence",
  author: "Edureka",
  platform: "Youtube",
  image: "https://img.youtube.com/vi/JMUxmLyrhSk/hqdefault.jpg",
  link: "https://www.youtube.com/embed/JMUxmLyrhSk",
  },

  ]


export function getCourses(): Course[] {
  return courses
}

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id)
}

