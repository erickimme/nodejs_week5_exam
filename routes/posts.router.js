// routes/posts.router.js

import express from 'express';
import { prisma } from '../utils/prisma/index.js';

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

/* 게시물 생성 Logic */
router.post('/posts', async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  } else {
    try {
      const createdPost = await prisma.posts.create({
        data: {
          title,
          content,
        },
      });

      const formattedData = {
        id: createdPost.id,
        title: createdPost.title,
        content: createdPost.content,
      };
      res.status(200).json(formattedData);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});

/*  전체 게시물 목록 조회 Logic */
router.get('/posts', async (req, res, next) => {
  try {
    const posts = await prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 상세 게시물 수정 Logic */
router.put('/posts/:postId', async (req, res, next) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  console.log(postId, title, content);

  if (!postId || !title || !content) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  } else {
    try {
      const post = await prisma.posts.findUnique({
        where: {
          id: Number(postId),
        },
      });
      if (!post) {
        res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
      } else {
        const updatedPost = await prisma.posts.update({
          where: {
            id: Number(postId),
          },
          data: {
            title,
            content,
          },
          select: {
            id: true,
            title: true,
            content: true,
          },
        });
        res.status(200).json(updatedPost);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});

/* 게시물 삭제 Logic */
router.delete('/posts/:postId', async (req, res, next) => {
  const { postId } = req.params;

  if (!postId) {
    res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
  } else {
    try {
      const post = await prisma.posts.findUnique({
        where: {
          id: Number(postId),
        },
      });
      if (!post) {
        res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
      } else {
        const deletedPost = await prisma.posts.delete({
          where: {
            id: Number(postId),
          },
        });
        res.status(200).json({ message: 'success' });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
});

export default router;
