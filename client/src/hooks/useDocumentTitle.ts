import { useEffect, useState } from 'react';

export default function (initalTitle: string) {
  const [title, setTitle] = useState(initalTitle);

  useEffect(() => {
    if (title) document.title = `U3T - ${title}`;
    else document.title = 'U3T - Ultimate Tic-Tac-Toe';
  }, [title]);

  return setTitle;
}
