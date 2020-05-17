declare abstract class PlyrProvider {
  static name: string;
  static config: object;
  static availableSpeed: Number[];
  static supportCaptions: boolean;
  // Specific events for the provider to listent to
  static events = [];
  static type = 'audio' | 'video';
  static setup(player: Plyr): void;
  static test(url: string): boolean;
  static beforeSetup?(player: Plyr): void;
  static async destroy(player): void;
}
