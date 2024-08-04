FILE=package.json

# npm install
if test -f "$FILE"; then
    echo ""
    echo "========================{ $FILE exists. Installing }========================"
    npm install 
    else return;
fi

# install vite stuff
npm install vite @vitejs/plugin-react vitest --save-dev

# uninstall cra stuff
npm uninstall react-scripts

# move index to root
mv public/index.html .

# make config file
touch vite.config.js

# write to vite.config.js
tee vite.config.js << END
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
        build: {
            outDir: 'build',
        },
        server: {
            proxy: {
                '/api':'http://localhost:5001',
            }
        },
        plugins: [react()],
    };
});
END

# change scripts in place

npm pkg set 'scripts.client'='vite'
npm pkg set 'scripts.build'='vite build'
npm pkg delete 'scripts.eject'




#  notify that the scripts need to be double checked
echo ""
echo "========================{ TODO }========================"
echo "check your package.json scripts!"
echo "eg: "scripts": {
        "start": "node server/server.js",
        "build": "vite build",
        "client": "vite",
        "server" : "nodemon server/server.js"
        } "

# rename all react files with .js extention to have .jsx
    # mv src/App.js src/App.jsx
    # mv src/index.js src/index.jsx
(mv 'src/index.js' 'src/index.jsx') || true

(mv 'src/components/App/App.js' 'src/components/App/App.jsx') || true


# remove all %PUBLIC_URL% from HTML file
sed -i '' -e "s/\%PUBLIC_URL\%//g" ./index.html
sed -i '' -e 's,<script type="module" src="/src/index.jsx"></script>,,g' ./index.html

# Add script to html
# <script type="module" src="/src/index.jsx"></script>
sed -i '' '/<\/body>/i\
<script type="module" src="/src/index.jsx"></script>\
' index.html
