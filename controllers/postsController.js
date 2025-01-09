const connection = require("../db/postsconn");

// INDEX
function index(req, res) {
  const sql = "SELECT * from posts";

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    res.json(results);
  });

  // FILTRO POST PER KEYWORD NEI TAGS
  // let filteredPosts = posts;
  // SE C'E' UNA KEY DO A TERM IL VALORE DELLA KEY, ALTRIMENTI DO VALORE NULLO
  // const term = req.query.term ?? "";
  // SE TERM HA UN VALORE FILTRO I POST PER QUELLI CHE INCLUDONO IL VALORE TRA I TAG
  // if (term) {
  //   filteredPosts = posts.filter((post) => {
  //     let isTermIncluded = false;
  //     // PER OGNI POST CONTROLLO SE OGNI TAG CONTIENE TERM
  //     post.tags.forEach((tag) => {
  //       if (tag.toLowerCase().includes(term.toLowerCase()))
  //         isTermIncluded = true;
  //     });
  //     return isTermIncluded;
  //   });
  // }
  // res.json({ filteredPosts, postNumber: filteredPosts.length });
}

// SHOW
function show(req, res) {
  const id = parseInt(req.params.id);

  // Controllo per ID non valido
  if (isNaN(id)) {
    const err = new Error("id not valid");
    // err.status = 400;
    throw err;
  }

  const postsSql = "SELECT * FROM posts WHERE id = ?";

  connection.query(postsSql, [id], (err, postsResults) => {
    if (err) return res.status(500).json({ error: "Database query failed" });
    if (postsResults.length === 0)
      return res.status(404).json({ error: "Post not found" });
    let post = postsResults[0];

    const tagsSql =
      "SELECT T.* FROM blog.tags AS T JOIN blog.post_tag AS PT ON T.id = PT.tag_id WHERE PT.post_id = ?";
    connection.query(tagsSql, [id], (err, tagsResults) => {
      if (err) return res.status(500).json({ error: "Database query failed" });
      post.tags = tagsResults;

      res.json(post);
    });
  });

  // const post = posts.find((post) => post.id === id);

  // // Controllo per ID non presente nella lista
  // if (!post) {
  //   const err = new Error("resource not found");
  //   err.status = 404;
  //   throw err;
  // }

  // res.json(post);
}

// STORE
function store(req, res) {
  const { title, content, img, category, published } = req.body;
  const id = posts.at(-1).id + 1;

  // Controllo se ci sono tutti i parametri
  if (!title || !content || !img || !category) {
    const err = new Error("invalid data");
    err.status = 400;
    throw err;
  }

  const post = { id, title, content, img, category, published };

  posts.push(post);
  res.status(201).json(posts);
}

// UPDATE
function update(req, res) {
  const id = parseInt(req.params.id);

  // Controllo per ID non valido
  if (isNaN(id)) {
    const err = new Error("id not valid");
    err.status = 400;
    throw err;
  }

  const post = posts.find((post) => post.id === id);

  // Controllo per ID non presente nella lista
  if (!post) {
    const err = new Error("resource not found");
    err.status = 404;
    throw err;
  }

  const { title, content, img, tags } = req.body;

  // Controllo se ci sono tutti i parametri
  if (!title || !content || !img || !Array.isArray(tags) || !tags?.length) {
    const err = new Error("invalid data");
    err.status = 400;
    throw err;
  }

  post.title = title;
  post.content = content;
  post.img = img;
  post.tags = tags;

  res.sendStatus(204);
}

// MODIFY
function modify(req, res) {
  const id = parseInt(req.params.id);

  // Controllo per ID non valido
  if (isNaN(id)) {
    const err = new Error("id not valid");
    err.status = 400;
    throw err;
  }

  const post = posts.find((post) => post.id === id);

  // Controllo per ID non presente nella lista
  if (!post) {
    const err = new Error("resource not found");
    err.status = 404;
    throw err;
  }

  const { title, content, img, tags } = req.body;

  if (title) {
    post.title = title;
  }
  if (content) {
    post.content = content;
  }
  if (img) {
    post.img = img;
  }
  if (Array.isArray(tags) && tags?.length) {
    post.tags = tags;
  }

  res.sendStatus(204);
}

// DESTROY
function destroy(req, res) {
  const id = parseInt(req.params.id);

  // Controllo per ID non valido
  if (isNaN(id)) {
    const err = new Error("id not valid");
    err.status = 400;
    throw err;
  }

  const sql = "DELETE FROM posts WHERE id = ?";

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to delete pizza" });
    res.sendStatus(204);
  });

  //   // Salvo l'elemento che sto eliminando e lo cerco nell'array
  //   const deleted = posts.find((post, index) => post.id === id);
  //   // Controllo per ID non presente nella lista
  //   if (!deleted) {
  //     const err = new Error("resource not found");
  //     err.status = 404;
  //     throw err;
  //   }

  //   // Stampo in console l'elemento eliminato
  //   console.log("Elemento eliminato: ", deleted);

  //   // Cancello l'elemento dall'array
  //   posts.splice(posts.indexOf(deleted), 1);

  //   // Stampo in console la lista aggiornata
  //   console.log("Lista aggiornata: ", posts);

  //   // Ritorno alla chiamata uno stato 204
  //   res.sendStatus(204);
}

module.exports = { index, show, store, update, modify, destroy };
