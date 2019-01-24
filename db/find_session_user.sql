select users.id, dob, profile_img, email, mobile_phone, address_street, address_city, address_state, address_postal_code, 
address_country, text_notify, email_notify, is_deleted, type, user_name, auth_id, first_name, last_name, country, in_app_notify
from users
JOIN countries on (users.address_country = countries.id)
where users.id = $1;