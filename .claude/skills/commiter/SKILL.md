---
name: commiter
description: Commite et pousse sur main selon les conventions de Donéo — sans branche, sans secrets, sans BOM dans le message. À utiliser dès qu'on demande de « commit », « push » ou « envoyer sur GitHub ».
---

# Commiter sur Donéo

## Règles

- **Toujours sur `main`**, directement. Pas de branche de fonctionnalité, pas de
  pull request : le groupe est petit et c'est la consigne.
- **Ajouter les fichiers un par un** (`git add chemin`), jamais `git add -A` ni
  `git add .`. Sont exclus d'office :
  - `doneo-3561b-firebase-adminsdk-*.json` (clé de service Firebase) ;
  - tout `.env`, `.dev.vars`, token Cloudflare ;
  - `.claude/settings.json` et `.claude/settings.local.json` (réglages locaux).
- **Ne pas toucher au `.gitignore`** sans demande explicite.
- Relire `git status` et `git diff --staged` avant de commiter.

## Message

Préfixe conventionnel en français (`feat:`, `fix:`, `docs:`, `chore:`), puis une
liste de ce qui change et pourquoi.

**Passer le message par Bash et un heredoc**, jamais par une chaîne PowerShell
redirigée : PowerShell 5.1 ajoute un BOM (`EF BB BF`) en tête du message, qui se
retrouve dans l'historique.

```bash
git commit -q -F - <<'EOF'
docs: resume court

- Detail 1.
- Detail 2.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
git push origin main
```

Si le Bash de l'environnement ne trouve pas `git`, préfixer la commande par
`export PATH="/usr/bin:/mingw64/bin:$PATH";`.

## Avant de commiter

- Des specs ont changé : lancer la skill `valider-specs`.
- Le front a changé : `cd public && npm run build` doit passer.
- Ne jamais réécrire l'historique poussé (`--amend`, `--force`) sans accord
  explicite ; si c'est accepté, utiliser `--force-with-lease=main:<ancien-sha>`.
