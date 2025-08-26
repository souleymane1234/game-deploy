class BalanceService {
  private static instance: BalanceService;
  private balance: number = 10000;
  private listeners: { [key: string]: Function[] } = {};
  private storageKey = '4win_platform_balance';

  private constructor() {
    this.loadBalanceFromStorage();
    this.setupStorageSync();
  }

  public static getInstance(): BalanceService {
    if (!BalanceService.instance) {
      BalanceService.instance = new BalanceService();
    }
    return BalanceService.instance;
  }

  private loadBalanceFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.balance = typeof data.balance === 'number' ? data.balance : 10000;
      }
    } catch (error) {
      console.error('Erreur lors du chargement du solde:', error);
      this.balance = 10000;
    }
  }

  private saveBalanceToStorage(): void {
    try {
      const data = {
        balance: this.balance,
        timestamp: Date.now(),
        platform: '4win'
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du solde:', error);
    }
  }

  private setupStorageSync(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          if (data.balance !== this.balance) {
            this.balance = data.balance;
            this.emit('balanceUpdate', this.balance);
          }
        } catch (error) {
          console.error('Erreur lors de la synchronisation du solde:', error);
        }
      }
    });
  }

  private emit(event: string, data: any): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Méthodes publiques
  public getBalance(): number {
    return this.balance;
  }

  public setBalance(newBalance: number): void {
    this.balance = newBalance;
    this.saveBalanceToStorage();
    this.emit('balanceUpdate', this.balance);
  }

  public addBalance(amount: number): boolean {
    if (amount < 0) {
      console.error('Tentative d\'ajout d\'un montant négatif:', amount);
      return false;
    }
    
    this.balance += amount;
    this.saveBalanceToStorage();
    this.emit('balanceUpdate', this.balance);
    console.log(`Solde ajouté: +${amount} FCFA, Nouveau solde: ${this.balance} FCFA`);
    return true;
  }

  public subtractBalance(amount: number): boolean {
    if (amount < 0) {
      console.error('Tentative de soustraction d\'un montant négatif:', amount);
      return false;
    }

    if (this.balance < amount) {
      console.error('Solde insuffisant pour soustraire:', amount, 'Solde actuel:', this.balance);
      return false;
    }

    this.balance -= amount;
    this.saveBalanceToStorage();
    this.emit('balanceUpdate', this.balance);
    console.log(`Solde soustrait: -${amount} FCFA, Nouveau solde: ${this.balance} FCFA`);
    return true;
  }

  public canAfford(amount: number): boolean {
    return this.balance >= amount;
  }

  public placeBet(amount: number): boolean {
    if (!this.canAfford(amount)) {
      console.log('Mise refusée: solde insuffisant');
      return false;
    }
    
    return this.subtractBalance(amount);
  }

  public addWinnings(amount: number): boolean {
    return this.addBalance(amount);
  }

  public on(event: string, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: string, callback: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Méthodes pour les jeux externes
  public handleGameMessage(type: string, data: any): any {
    switch (type) {
      case 'REQUEST_BALANCE':
        return { type: 'BALANCE_UPDATE', balance: this.balance };
      
      case 'PLACE_BET':
        if (this.placeBet(data.amount)) {
          return { type: 'BET_PLACED', amount: data.amount };
        } else {
          return { type: 'BET_REJECTED', reason: 'insufficient_balance' };
        }
      
      case 'GAME_WON':
        if (data.amount && data.amount > 0) {
          this.addWinnings(data.amount);
          return { type: 'WIN_PROCESSED', amount: data.amount };
        }
        break;
      
      case 'GAME_LOST':
        // La mise a déjà été soustraite lors du placement
        return { type: 'LOSS_PROCESSED' };
      
      default:
        return null;
    }
  }

  // Méthode de test pour vérifier la synchronisation
  public testBalanceSync(): void {
    console.log('🧪 Test de synchronisation du solde:');
    console.log('Solde actuel:', this.balance);
    console.log('Test d\'ajout de 100 FCFA...');
    this.addBalance(100);
    console.log('Nouveau solde:', this.balance);
    console.log('Test de soustraction de 50 FCFA...');
    this.subtractBalance(50);
    console.log('Solde final:', this.balance);
    console.log('✅ Test terminé');
  }
}

export default BalanceService;
