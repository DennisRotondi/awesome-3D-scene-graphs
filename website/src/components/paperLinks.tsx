import React from 'react';
import { FaHome, FaGithub, FaYoutube } from 'react-icons/fa';
import { FaRegFilePdf } from 'react-icons/fa';
import type { Paper } from './papers';

export type PaperLink = { url: string; label: string; icon: React.ReactElement };

export function getPaperLinks(paper: Paper): PaperLink[] {
  return [
    { url: paper.SITE, label: 'Website', icon: <FaHome /> },
    { url: paper.CODE, label: 'Code', icon: <FaGithub /> },
    { url: paper.ARXIV, label: 'arXiv', icon: <FaRegFilePdf /> },
    { url: paper.VIDEO, label: 'Video', icon: <FaYoutube /> },
  ].filter((l) => Boolean(l.url));
}
