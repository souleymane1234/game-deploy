# 🧪 Test de Synchronisation localStorage

Ce guide vous aide à tester la synchronisation de la balance via localStorage entre la plateforme et le jeu TicTacToe.

## 🚀 Démarrage

### 1. **Démarrer les projets**
```bash
# Terminal 1 - Plateforme principale
cd 4win-platform
npm start

# Terminal 2 - TicTacToe
cd TicTacToe
npm run node-start
```

### 2. **Accéder aux URLs**
- **Plateforme** : http://localhost:3000
- **TicTacToe intégré** : http://localhost:3000/tic-tac-toe
- **TicTacToe direct** : http://localhost:9750

## 🔍 Tests de Synchronisation

### **Test 1 : Synchronisation Initiale**

1. Ouvrez la plateforme : http://localhost:3000
2. Notez le solde initial (ex: 10000€)
3. Ouvrez le jeu TicTacToe : http://localhost:3000/tic-tac-toe
4. Vérifiez que le BalanceDisplay affiche le même solde
5. ✅ **Résultat attendu** : Les deux solde sont identiques

### **Test 2 : Changement de Solde dans la Plateforme**

1. Dans la plateforme, jouez à Lucky Jet ou Dice
2. Changez votre solde (gagnez ou perdez de l'argent)
3. Retournez au TicTacToe
4. Vérifiez que le BalanceDisplay se met à jour automatiquement
5. ✅ **Résultat attendu** : Le solde se synchronise en temps réel

### **Test 3 : Changement de Solde dans TicTacToe**

1. Dans TicTacToe, placez une mise et jouez
2. Gagnez ou perdez de l'argent
3. Retournez à la plateforme principale
4. Vérifiez que le solde se met à jour
5. ✅ **Résultat attendu** : Le solde se synchronise dans les deux sens

### **Test 4 : localStorage Direct**

1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet "Application" > "Local Storage"
3. Vérifiez la clé `4win_platform_balance`
4. Modifiez manuellement la valeur :
   ```json
   {
     "balance": 15000,
     "timestamp": 1234567890,
     "gameId": "tic-tac-toe"
   }
   ```
5. Vérifiez que les deux interfaces se mettent à jour
6. ✅ **Résultat attendu** : Synchronisation immédiate

### **Test 5 : Déconnexion/Reconnexion**

1. Fermez l'onglet TicTacToe
2. Modifiez le solde dans la plateforme
3. Rouvrez TicTacToe
4. Vérifiez que le solde se charge correctement
5. ✅ **Résultat attendu** : Le solde persiste et se synchronise

## 🔧 Debugging

### **Vérifier localStorage**
```javascript
// Dans la console du navigateur
console.log('Balance dans localStorage:', localStorage.getItem('4win_platform_balance'));
```

### **Vérifier la Communication**
```javascript
// Dans la console de TicTacToe
console.log('Balance du service:', communicationService.getBalance());
console.log('Connexion:', communicationService.isConnectedToParent());
```

### **Forcer la Synchronisation**
```javascript
// Dans la console de TicTacToe
communicationService.forceSyncFromStorage();
```

## 🐛 Problèmes Courants

### **Problème 1 : Balance ne se met pas à jour**
**Solution :**
- Vérifiez que les deux projets sont démarrés
- Vérifiez la console pour les erreurs
- Forcez la synchronisation : `communicationService.forceSyncFromStorage()`

### **Problème 2 : localStorage vide**
**Solution :**
- Vérifiez que la clé `4win_platform_balance` existe
- Vérifiez les permissions du navigateur
- Essayez de recharger la page

### **Problème 3 : Communication postMessage ne fonctionne pas**
**Solution :**
- Vérifiez que TicTacToe est dans une iframe
- Vérifiez les erreurs CORS
- Vérifiez que les URLs correspondent

## 📊 Monitoring

### **Logs à Surveiller**

Dans la console de TicTacToe :
```
Solde mis à jour: 10000
```

Dans la console de la plateforme :
```
Gain: 50 Nouveau solde: 10050
Perte: 25 Nouveau solde: 10025
```

### **Indicateurs Visuels**

- **BalanceDisplay** : Affiche le solde en temps réel
- **Status de connexion** : Vert = Connecté, Rouge = Déconnecté
- **Animation pulse** : Indique une connexion active

## ✅ Critères de Succès

1. ✅ **Synchronisation bidirectionnelle** : Les changements se propagent dans les deux sens
2. ✅ **Persistance** : Le solde persiste après rechargement
3. ✅ **Temps réel** : Mise à jour en moins de 3 secondes
4. ✅ **Robustesse** : Fonctionne même en cas de déconnexion temporaire
5. ✅ **Cohérence** : Même valeur affichée partout

## 🎯 Test Final

1. Démarrez les deux projets
2. Testez tous les scénarios ci-dessus
3. Vérifiez que la balance reste cohérente
4. Testez avec différents montants
5. Vérifiez la persistance après redémarrage

Si tous les tests passent, la synchronisation localStorage fonctionne parfaitement ! 🎉
