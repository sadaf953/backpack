// pages/api/courses/delete.ts
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        try {
            const { id } = req.body;
            const deletedCourse = await prisma.course.delete({
                where: { id },
            });
            res.status(200).json(deletedCourse);
        } catch (error) {
            console.error('Error deleting course:', error);
            res.status(500).json({ error: 'Failed to delete course' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
