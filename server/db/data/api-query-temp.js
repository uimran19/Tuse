`https://api.artic.edu/api/v1/artworks/search

?fields=id,
title,
artist_title,
has_not_been_viewed_much,
description,
short_description,
date_start,
date_end,
place_of_origin,
artist_display,
style_title,
classification_title,
technique_titles,
image_id

&query[term][is_public_domain]=true
&limit=100`;

`https://api.artic.edu/api/v1/artworks/search?fields=id,classification_title&query[term][classification_title]=%22painting%22&limit=100`;
