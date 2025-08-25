/**
 * Service de communication universel pour les jeux externes
 * Ce service gère la communication avec la plateforme parent via postMessage et localStorage
 */

interface CommunicationMessage {
  type: string;
  data?: any;
}

interface BalanceUpdate {
  balance: number;
}

interface GameEvent {
  eventType: string;
  amount?: number;
  winAmount?: number;
  loseAmount?: number;
  betAmount?: number;
}

class CommunicationService {
  private balance: number = 0;
  private isConnected: boolean = false;
  private currentBet: number = 0;
  private eventHandlers: Map<string, Function[]> = new Map();
  private storageKey: string = '4win_platform_balance';
  private lastUpdateKey: string = '4win_platform_last_update';

  constructor() {
    this.initializeCommunication();
  }

  /**
   * Initialise la communication avec la plateforme parent
   */
  private initializeCommunication(): void {
    // Écoute les messages de la plateforme parent
    window.addEventListener('message', this.handleParentMessage.bind(this));
    
    // Écoute les changements de localStorage
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Notifie la plateforme parent que le jeu est prêt
    this.sendToParent({
      type: 'GAME_READY',
      data: {
        gameId: this.getGameId(),
        version: '1.0.0'
      }
    });

    // Charge le solde depuis localStorage
    this.loadBalanceFromStorage();
    
    // Demande le solde initial
    this.requestBalance();
    
    // Vérifie périodiquement la connexion et synchronise
    setInterval(() => {
      this.sendToParent({ type: 'PING' });
      this.syncBalanceFromStorage();
    }, 5000); // Vérification toutes les 5 secondes
  }

  /**
   * Gère les messages reçus de la plateforme parent
   */
  private handleParentMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    switch (type) {
      case 'BALANCE_UPDATE':
        this.updateBalance(data.balance);
        break;
        
      case 'PONG':
        this.isConnected = true;
        break;
        
      case 'BET_PLACED':
        this.currentBet = data.amount;
        this.triggerEvent('betPlaced', data);
        break;
        
      case 'GAME_START':
        this.triggerEvent('gameStart', data);
        break;
        
      case 'GAME_END':
        this.triggerEvent('gameEnd', data);
        break;
    }
  }

  /**
   * Gère les changements de localStorage
   */
  private handleStorageChange(event: StorageEvent): void {
    if (event.key === this.storageKey) {
      const newBalance = this.parseBalanceFromStorage(event.newValue);
      if (newBalance !== null && newBalance !== this.balance) {
        this.updateBalance(newBalance);
      }
    }
  }

  /**
   * Charge le solde depuis localStorage
   */
  private loadBalanceFromStorage(): void {
    const storedBalance = localStorage.getItem(this.storageKey);
    if (storedBalance) {
      const balance = this.parseBalanceFromStorage(storedBalance);
      if (balance !== null) {
        this.updateBalance(balance);
      }
    }
  }

  /**
   * Synchronise le solde depuis localStorage
   */
  private syncBalanceFromStorage(): void {
    const storedBalance = localStorage.getItem(this.storageKey);
    if (storedBalance) {
      const balance = this.parseBalanceFromStorage(storedBalance);
      if (balance !== null && balance !== this.balance) {
        this.updateBalance(balance);
      }
    }
  }

  /**
   * Parse le solde depuis localStorage
   */
  private parseBalanceFromStorage(storedValue: string | null): number | null {
    if (!storedValue) return null;
    
    try {
      const data = JSON.parse(storedValue);
      return typeof data.balance === 'number' ? data.balance : null;
    } catch (error) {
      console.error('Erreur lors du parsing du solde:', error);
      return null;
    }
  }

  /**
   * Sauvegarde le solde dans localStorage
   */
  private saveBalanceToStorage(balance: number): void {
    try {
      const data = {
        balance: balance,
        timestamp: Date.now(),
        gameId: this.getGameId()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      localStorage.setItem(this.lastUpdateKey, Date.now().toString());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du solde:', error);
    }
  }

  /**
   * Envoie un message à la plateforme parent
   */
  public sendToParent(message: CommunicationMessage): void {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(message, '*');
    }
  }

  /**
   * Demande la mise à jour du solde
   */
  public requestBalance(): void {
    this.sendToParent({ type: 'REQUEST_BALANCE' });
  }

  /**
   * Met à jour le solde local
   */
  private updateBalance(newBalance: number): void {
    this.balance = newBalance;
    this.saveBalanceToStorage(newBalance);
    this.triggerEvent('balanceUpdate', { balance: newBalance });
  }

  /**
   * Place une mise
   */
  public placeBet(amount: number): boolean {
    if (amount <= this.balance) {
      this.currentBet = amount;
      this.sendToParent({
        type: 'PLACE_BET',
        data: { amount }
      });
      return true;
    }
    return false;
  }

  /**
   * Notifie le début d'une partie
   */
  public onGameStart(): void {
    this.sendToParent({
      type: 'GAME_STARTED',
      data: { betAmount: this.currentBet }
    });
  }

  /**
   * Notifie la fin d'une partie
   */
  public onGameEnd(result: 'win' | 'lose' | 'draw', amount?: number): void {
    const eventData: GameEvent = {
      eventType: result,
      betAmount: this.currentBet
    };

    if (result === 'win' && amount) {
      eventData.winAmount = amount;
    } else if (result === 'lose') {
      eventData.loseAmount = this.currentBet;
    }

    this.sendToParent({
      type: 'GAME_ENDED',
      data: eventData
    });
  }

  /**
   * Notifie un gain
   */
  public onWin(amount: number): void {
    this.sendToParent({
      type: 'GAME_WON',
      data: { winAmount: amount }
    });
  }

  /**
   * Notifie une perte
   */
  public onLose(amount: number): void {
    this.sendToParent({
      type: 'GAME_LOST',
      data: { loseAmount: amount }
    });
  }

  /**
   * Obtient le solde actuel
   */
  public getBalance(): number {
    return this.balance;
  }

  /**
   * Obtient la mise actuelle
   */
  public getCurrentBet(): number {
    return this.currentBet;
  }

  /**
   * Vérifie si connecté à la plateforme parent
   */
  public isConnectedToParent(): boolean {
    return this.isConnected;
  }

  /**
   * Ajoute un écouteur d'événement
   */
  public addEventListener(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * Déclenche un événement
   */
  private triggerEvent(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }

  /**
   * Obtient l'ID du jeu (à surcharger dans chaque jeu)
   */
  private getGameId(): string {
    return 'external-game';
  }

  /**
   * Synchronise le solde avec la plateforme parent
   */
  public syncBalance(): void {
    this.requestBalance();
    this.syncBalanceFromStorage();
  }

  /**
   * Force la synchronisation depuis localStorage
   */
  public forceSyncFromStorage(): void {
    this.loadBalanceFromStorage();
  }
}

// Instance singleton
const communicationService = new CommunicationService();

export default communicationService;
