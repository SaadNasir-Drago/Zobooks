select * from public.books;
SELECT * FROM public.genres;
select * from public.genre_books;
select * from public.likes;
select * from public.users;
drop table public."users",  public."books", public."genre_books", public."genres", public."likes";
SELECT genre_id from genres WHERE genre_name = 'Drama';

SELECT COUNT(DISTINCT b.book_id) AS total_books
    FROM books b
    LEFT JOIN genre_books gb ON b.book_id = gb.book_id
	