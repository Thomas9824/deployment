# Portfolio Website - Instructions de déploiement

Ce projet est une application Next.js optimisée pour le déploiement sur Azure.

## Prérequis

- Node.js 18.x ou supérieur
- npm ou yarn
- Un compte Azure avec une VM configurée

## Installation

1. Clonez ce dépôt sur votre VM Azure :
```bash
git clone <votre-repo>
cd <votre-repo>
```

2. Installez les dépendances :
```bash
npm install
# ou
yarn install
```

3. Construisez l'application :
```bash
npm run build
# ou
yarn build
```

4. Démarrez l'application en mode production :
```bash
npm run start
# ou
yarn start
```

## Configuration du serveur

1. Installez PM2 pour gérer le processus Node.js :
```bash
npm install -g pm2
```

2. Démarrez l'application avec PM2 :
```bash
pm2 start npm --name "portfolio" -- start
```

3. Configurez PM2 pour démarrer automatiquement au redémarrage :
```bash
pm2 startup
pm2 save
```

## Configuration Nginx (recommandé)

1. Installez Nginx :
```bash
sudo apt update
sudo apt install nginx
```

2. Créez un fichier de configuration pour votre site :
```bash
sudo nano /etc/nginx/sites-available/portfolio
```

3. Ajoutez la configuration suivante :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Activez la configuration :
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Sécurité

- Configurez un pare-feu (UFW) :
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw enable
```

- Installez et configurez SSL avec Certbot :
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

## Maintenance

- Pour voir les logs :
```bash
pm2 logs portfolio
```

- Pour redémarrer l'application :
```bash
pm2 restart portfolio
```

- Pour mettre à jour l'application :
```bash
git pull
npm install
npm run build
pm2 restart portfolio
``` 