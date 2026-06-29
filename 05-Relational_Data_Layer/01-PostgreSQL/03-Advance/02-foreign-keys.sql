 

 -- foreign key is a col that point to the primary key of anOther table.
 -- users.id - Parent key
 -- posts.user_id - Foreign Key
 -- Evey post u will create must belongs to an existing users


 SELECT id, name 
 FROM users;

 SELECT id, user_id, title
 FROM posts;