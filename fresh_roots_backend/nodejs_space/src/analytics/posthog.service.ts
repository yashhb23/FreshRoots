import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';

@Injectable()
export class PostHogService implements OnModuleDestroy {
  private client: PostHog;
  private enabled: boolean;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('POSTHOG_API_KEY');
    const host = this.configService.get<string>('POSTHOG_HOST') || 'https://app.posthog.com';

    if (apiKey) {
      this.client = new PostHog(apiKey, {
        host: host,
        flushAt: 20,
        flushInterval: 10000,
      });
      this.enabled = true;
      console.log('✅ PostHog analytics initialized');
    } else {
      this.enabled = false;
      console.warn('⚠️  PostHog API key not found. Analytics disabled.');
    }
  }

  /**
   * Track an event
   */
  async track(
    userId: string,
    event: string,
    properties?: Record<string, any>,
  ): Promise<void> {
    if (!this.enabled) return;

    try {
      this.client.capture({
        distinctId: userId,
        event: event,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          source: 'backend',
        },
      });
    } catch (error) {
      console.error('PostHog tracking error:', error);
    }
  }

  /**
   * Identify a user with properties
   */
  async identify(
    userId: string,
    properties?: Record<string, any>,
  ): Promise<void> {
    if (!this.enabled) return;

    try {
      this.client.identify({
        distinctId: userId,
        properties: properties,
      });
    } catch (error) {
      console.error('PostHog identify error:', error);
    }
  }

  /**
   * Track page view
   */
  async pageView(
    userId: string,
    pageName: string,
    properties?: Record<string, any>,
  ): Promise<void> {
    return this.track(userId, '$pageview', {
      $current_url: pageName,
      ...properties,
    });
  }

  /**
   * Flush all pending events (call before app shutdown)
   */
  async shutdown(): Promise<void> {
    if (!this.enabled) return;
    await this.client.shutdown();
  }

  onModuleDestroy() {
    this.shutdown();
  }
}
