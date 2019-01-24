insert into users
(profile_img, auth_id, email, first_name, last_name, type )
values($1, $2, $3, $4, $5, $6)
RETURNING *;