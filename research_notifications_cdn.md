# Research Report: Notification and Media Infrastructure Analysis

**Date:** 2026-01-22

**Objective:** This report provides a comparative analysis of leading infrastructure providers for push notifications, email services, and Content Delivery Networks (CDNs) with image optimization. The analysis evaluates providers based on cost, performance, features, and ease of integration, culminating in specific recommendations for each category.

---

## 1. Push Notification Providers

This section evaluates push notification services for mobile applications built with React Native/Expo, comparing Firebase Cloud Messaging (FCM), OneSignal, and Expo Push Notifications.

### 1.1. Comparative Analysis

**Firebase Cloud Messaging (FCM)**
FCM is Google's foundational cross-platform messaging solution, serving as the underlying technology for many other push services. It is a robust and highly scalable service that handles message delivery to Android devices and routes them to the Apple Push Notification service (APNs) for iOS.

*   **Ease of Integration:** Integration with React Native/Expo is well-documented and officially supported. However, it requires more manual setup, especially for iOS (APNs configuration), compared to more abstracted services.
*   **Features:** The Firebase console provides basic tools for sending notifications but lacks the advanced segmentation, A/B testing, and campaign management features found in dedicated marketing platforms. Advanced targeting typically requires custom coding or integration with other Firebase services like Analytics.
*   **Reliability & Delivery:** As a core Google service, FCM is highly reliable. It forms the backbone of Android notifications and is a critical part of the ecosystem.
*   **Cost:** FCM is largely free, with generous limits that are sufficient for the vast majority of applications.

**OneSignal**
OneSignal is a comprehensive customer engagement platform built on top of services like FCM and APNs. It is designed for both developers and marketing teams, offering a rich feature set that extends beyond basic push notifications.

*   **Ease of Integration:** OneSignal provides an official SDK for React Native and an Expo config plugin, simplifying the integration process.
*   **Features:** This is OneSignal's primary strength. It offers a powerful dashboard for creating and managing campaigns without code, advanced user segmentation, A/B testing, rich media notifications, in-app messaging, and omnichannel support (email, SMS).
*   **Reliability & Delivery:** OneSignal is known for reliable, high-volume delivery. However, some users have reported discrepancies in *confirmed delivery* metrics after migrating SDK versions (e.g., v4 to v5) or changing development workflows. These reports suggest the issue may be with analytics reporting rather than actual notification delivery, but it is a factor to monitor.
*   **Cost:** OneSignal offers a generous free tier. Paid plans are based on monthly active users and can become a significant operational expense as an app scales. For example, pricing is approximately $39/month for 10,000 users and $309/month for 100,000 users.

**Expo Push Notifications**
The Expo push notification service is a convenience layer designed to dramatically simplify sending notifications for apps built within the Expo ecosystem. It abstracts away the complexities of managing native device tokens and communicating directly with FCM and APNs.

*   **Ease of Integration:** This is the easiest and fastest option for developers using Expo. It works out-of-the-box with Expo Go during development and simplifies token management through a unified API.
*   **Features:** The service is focused on the core task of delivering notifications. It lacks the advanced marketing, segmentation, and analytics features of OneSignal. An EAS dashboard provides basic tracking of delivery to FCM/APNs.
*   **Reliability & Delivery:** While it simplifies development, production apps still require their own FCM and APNs credentials for maximum reliability. The service has a volume limit of 600 notifications per second per project. It relies on Expo's servers, which may be a consideration for enterprise use cases requiring full control.
*   **Cost:** The service is free to use for basic functionality, making it highly attractive for new projects and prototypes.

### 1.2. Recommendation: Push Notifications

For a new project developed with React Native/Expo, a phased approach is recommended.

1.  **Initial Development & MVP:** Start with **Expo Push Notifications**. Its unparalleled ease of integration allows for rapid development and testing without the overhead of native configuration. It is the most efficient choice for getting a product to market quickly.
2.  **Scaling & Growth:** As the user base grows and marketing requirements become more sophisticated (e.g., segmentation, automated campaigns, A/B testing), migrate to **OneSignal**. Its powerful feature set empowers both marketing and development teams. While more expensive at scale, the value derived from its advanced engagement tools justifies the cost for a growing application. It is crucial to store both Expo push tokens and native device tokens from the beginning to facilitate a smoother future migration.

**Estimated Costs:**
*   **Expo Push Notifications:** $0 for core service usage.
*   **OneSignal:** $0 on the free tier. Paid plans start at ~$9/month for 1,000 users and scale with the user base.

---

## 2. Email Service Providers

This section analyzes transactional and marketing email providers, comparing global leaders SendGrid, Mailgun, and AWS SES, and considering local providers in Mauritius.

### 2.1. Comparative Analysis

**Amazon Simple Email Service (AWS SES)**
AWS SES is a cloud-based email service designed for high-volume sending. It is a bare-bones, highly scalable, and cost-effective solution for developers.

*   **Deliverability:** Backed by Amazon's robust infrastructure, SES can achieve excellent deliverability. However, it places the responsibility on the user to manage their sender reputation, including configuring DKIM/SPF and warming up dedicated IPs.
*   **API & Features:** SES provides a powerful API but has a steep learning curve. The service is developer-focused and lacks the user-friendly template editors or marketing campaign dashboards of its competitors. Analytics are basic unless integrated with other AWS services like CloudWatch.
*   **Cost:** SES is the undisputed leader in cost-effectiveness. It operates on a pay-as-you-go model at approximately **$0.10 per 1,000 emails**. A generous free tier of 62,000 emails per month is available for applications hosted on AWS EC2. A dedicated IP costs an additional $24.95/month.

**Mailgun**
Mailgun is an API-first email service built for developers. It strikes a balance between the raw power of SES and the user-friendliness of SendGrid.

*   **Deliverability:** Mailgun has a strong reputation for high deliverability, supported by features like email validation services to reduce bounce rates, reputation monitoring, and detailed analytics. One deliverability test showed a 71.4% inbox placement rate.
*   **API & Features:** Its core strength is a clean, well-documented API. It offers features like inbound email routing and event webhooks. The user interface is clear and functional, though less focused on marketing users than SendGrid.
*   **Cost:** Mailgun offers a trial period and then transitions to a pay-as-you-go "Flex" plan or tiered subscriptions. The Flex plan costs approximately **$0.80 per 1,000 emails**. Paid plans start around $35/month for 50,000 emails.

**SendGrid**
SendGrid is a popular all-in-one platform that caters to both developers (for transactional emails) and marketers (for campaigns).

*   **Deliverability:** SendGrid provides robust tools for deliverability management. However, in one comparative test, it showed a lower inbox placement rate (61.0%) and a higher rate of missing emails compared to Mailgun. Access to features like a dedicated IP or email validation often requires a higher-tier plan.
*   **API & Features:** SendGrid offers a user-friendly dashboard, an intuitive email editor with pre-built templates, and advanced marketing features like A/B testing and detailed engagement analytics. This makes it highly accessible to non-technical team members.
*   **Cost:** SendGrid's free plan is limited to 100 emails/day after the first month. Paid plans start at $14.95/month for up to 40,000 emails. It is generally considered more expensive than its competitors, especially as feature needs increase.

### 2.2. Local Mauritius Providers

Analysis of local Mauritian providers like **GlobexCamHost** and **RightWay Gate** indicates their services are primarily focused on private and business email hosting (e.g., `user@yourcompany.mu`) rather than high-volume, API-driven transactional email delivery for applications. While they offer important features like spam protection and uptime guarantees for standard business communication, they do not compete in the same category as scalable email API platforms like SES, Mailgun, or SendGrid.

### 2.3. Recommendation: Email Services

For a scalable application requiring a robust and cost-effective transactional email solution, **AWS SES** is the top recommendation. Its extremely low cost at scale provides a significant long-term advantage. This recommendation assumes the availability of technical resources to manage the initial setup and ongoing reputation monitoring.

If developer experience and a faster time-to-market are prioritized over absolute lowest cost, **Mailgun** is an excellent alternative. Its developer-centric approach and strong deliverability features provide a great balance of power and ease of use.

**Estimated Costs:**
*   **AWS SES:** **~$0.10 per 1,000 emails**. A dedicated IP is **$24.95/month**. For 200,000 emails/month, the cost would be approximately $20 (plus the IP cost).
*   **Mailgun:** **~$0.80 per 1,000 emails** on the Flex plan. For 200,000 emails/month, the cost would be approximately $160.

---

## 3. CDN and Image Optimization

This section evaluates services for storing, transforming, and delivering images and other media assets, with a focus on performance in the Mauritius/Africa region.

### 3.1. Comparative Analysis

**Cloudinary**
Cloudinary is a comprehensive, end-to-end media management platform. It combines storage, powerful real-time image and video transformations, and delivery via a high-performance CDN into a single, easy-to-use service.

*   **Image Transformations:** This is a major strength. Cloudinary offers a vast array of transformations via a simple URL-based API, including resizing, content-aware cropping, format optimization (e.g., automatic WebP/AVIF delivery), watermarking, and AI-powered features.
*   **Performance:** Cloudinary uses a multi-CDN approach to ensure fast global delivery.
*   **Cost:** Cloudinary uses a credit-based system where 1 credit equals 1,000 transformations, 1 GB of storage, or 1 GB of bandwidth. The free tier includes 25 credits per month. While excellent for getting started, costs can escalate quickly with high traffic, often becoming significantly more expensive than a self-managed AWS solution.

**AWS CloudFront + S3 (+ Lambda@Edge)**
This is a "build-your-own" solution using core AWS components. Amazon S3 is used for storage, CloudFront serves as the CDN, and Lambda@Edge functions are used to perform image transformations on the fly at the edge.

*   **Image Transformations:** All transformation logic must be custom-built using Lambda functions. This requires significant initial and ongoing engineering effort but offers complete control and flexibility.
*   **Performance:** AWS CloudFront is a top-tier global CDN. With proper configuration, it delivers excellent performance.
*   **Cost:** This is the most cost-effective solution at scale. Scenario-based analysis shows that for an application with 1.8 TB of monthly bandwidth, an AWS solution would cost approximately **$175/month**, whereas Cloudinary could cost **$800-$1,200/month**. The cost savings become even more dramatic at higher volumes.

**Imgix**
Imgix is a specialized service focused on real-time image processing and delivery. It sits between the user's storage (like S3) and the end-user, transforming images via a URL-based API.

*   **Image Transformations:** Imgix offers best-in-class rendering quality and a powerful transformation API, similar to Cloudinary.
*   **Performance:** It provides a fast, globally distributed CDN service.
*   **Cost:** Imgix uses fixed-quota plans based on the number of "origin images" and can be pricey. It is generally more expensive than a custom AWS setup but competitive with Cloudinary, depending on the use case.

### 3.2. CDN Performance in Mauritius & Africa

CDN performance in the region is critically dependent on the presence of local Points of Presence (PoPs).

*   **Cloudflare** has a documented **PoP in Mauritius**. This is a significant advantage, as it allows traffic to be served locally, drastically reducing latency for users in the region compared to routing requests to Europe or Asia.
*   **AWS CloudFront** has PoPs in South Africa and Kenya. While beneficial for the continent, traffic from Mauritius may still experience higher latency than with a local PoP.
*   **Bunny.net** has 13 PoPs in the Middle East & Africa region but does not list one in Mauritius.

The presence of a Cloudflare PoP in Mauritius makes any service utilizing its network particularly attractive for optimizing performance for local users.

### 3.3. Recommendation: CDN and Image Optimization

A phased approach is recommended to balance initial development speed with long-term cost optimization.

1.  **Initial Development & MVP:** Start with **Cloudinary**. Its generous free tier (25 credits/month) is often sufficient for small projects. The ease of use and powerful, out-of-the-box transformation capabilities will significantly accelerate development, eliminating the need for complex infrastructure setup.
2.  **Scaling & Growth:** Monitor bandwidth and transformation usage closely. Once monthly bandwidth consistently exceeds **1-2 TB**, the cost of Cloudinary will likely become substantial. At this point, a planned migration to a custom **AWS S3 + CloudFront + Lambda@Edge** solution is recommended. The significant cost savings (potentially 60-85%) will justify the engineering investment required for the migration and maintenance. Given its local PoP, configuring CloudFront to peer with or use **Cloudflare** could be an optimal strategy for Mauritius-specific performance.

**Estimated Costs:**
*   **Cloudinary:** $0 on the free tier. Paid plans can range from hundreds to thousands of dollars per month depending on traffic.
*   **AWS S3 + CloudFront + Lambda@Edge:** Highly variable based on usage. For a high-traffic scenario (10 TB bandwidth/month), the cost is estimated at **~$1,022/month**, compared to an estimated **$5,000-$8,000/month** for Cloudinary.

---

## 4. References

1. [what is the difference between these services for push notifications? - reddit.com](https://www.reddit.com/r/reactnative/comments/1ibzjvb/what_is_the_difference_between_these_services_for/)
2. [Expo vs OneSignal Push - courier.com](https://www.courier.com/integrations/compare/expo-vs-onesignal-push)
3. [Push Notifications Pricing - courier.com](https://www.courier.com/integrations/pricing/push-notifications)
4. [Top 5 Push Notification Services for Expo & React Native in 2025 - pushbase.dev](https://pushbase.dev/blog/top-5-push-notification-services-for-expo-react-native-in-2025)
5. [Using third-party push notification services - expo.dev](https://docs.expo.dev/guides/using-push-notifications-services/)
6. [React Native SDK setup - onesignal.com](https://documentation.onesignal.com/docs/en/react-native-sdk-setup)
7. [react-native-onesignal - npm - npmjs.com](https://www.npmjs.com/package/react-native-onesignal)
8. [GitHub - OneSignal/react-native-onesignal: React Native Library for OneSignal Push Notifications Service - github.com](https://github.com/OneSignal/react-native-onesignal)
9. [[Bug]: Significant Drop in Confirmed Deliveries After Migration to v5 + Expo · Issue #1760 · OneSignal/react-native-onesignal - github.com](https://github.com/OneSignal/react-native-onesignal/issues/1760)
10. [Pricing - OneSignal - onesignal.com](https://onesignal.com/pricing)
11. [Amazon SES vs Mailgun vs SendGrid: Which Is the Best? - deliciousbrains.com](https://deliciousbrains.com/ses-vs-mailgun-vs-sendgrid/)
12. [Selecting an Email Delivery Platform: Key Players Compared (2025) - suprsend.com](https://www.suprsend.com/post/selecting-an-email-delivery-platform-key-players-compared-2025)
13. [SendGrid vs Mailgun: Which Is Better in 2024? - moosend.com](https://moosend.com/blog/sendgrid-vs-mailgun/)
14. [SendGrid vs. Mailgun: A Detailed Comparison - mailtrap.io](https://mailtrap.io/blog/sendgrid-vs-mailgun/)
15. [Amazon SES vs SendGrid: Which One to Choose in 2024? - fluentsmtp.com](https://fluentsmtp.com/articles/amazon-ses-vs-sendgrid/)
16. [Mauritius Business Email Lists - bizprospex.com](https://bizprospex.com/product/mauritius-business-email-lists/)
17. [Private Email Hosting in Mauritius - globexcamhost.com](https://mail.globexcamhost.com/en/webhosting/private-email-hosting-in-mauritius)
18. [The 6 Best Transactional Email Services in 2024 - emailtooltester.com](https://www.emailtooltester.com/en/blog/best-transactional-email-service/)
19. [Unlimited Email for .net.mu domains in Mauritius - rwgusa.com](https://www.rwgusa.com/unlimited_email_net_mu_mauritius.htm)
20. [EmailDelivery.com - emaildelivery.com](https://emaildelivery.com/)
21. [AWS S3 vs Cloudinary vs imgix: Total Cost Breakdown for Image-Heavy Applications - knackforge.com](https://knackforge.com/blog/aws-s3)
22. [Cloudinary vs Imgix: What is the difference? - bytescale.com](https://www.bytescale.com/blog/cloudinary-vs-imgix/)
23. [Overwhelmed with the idea of AWS S3/Cloudfront image optimization - reddit.com](https://www.reddit.com/r/webdev/comments/17pf2ya/overwhelmed_with_the_idea_of_aws_s3cloudfront/)
24. [Right S3 & CloudFront strategy for storing and serving files uploaded by users - reddit.com](https://www.reddit.com/r/aws/comments/zh2i2h/right_s3_cloudfront_strategy_for_storing_and/)
25. [Cloudinary alternative | Feature, integration & price comparison | ImageKit.io - imagekit.io](https://imagekit.io/cloudinary-alternative/)
26. [Global CDN Network | Low latency CDN with 119+ PoPs - bunny.net](https://bunny.net/network/)
27. [Measuring Cloud Latency in Africa - cs.uct.ac.za](https://pubs.cs.uct.ac.za/id/eprint/1704/1/Measuring_Cloud_Latency_in_Africa.pdf)
28. [CDNPerf - CDN Performance and Uptime monitoring, comparison and analytics - RUM data - cdnperf.com](https://www.cdnperf.com/)
29. [Mombasa, Kenya: CloudFlare's 43rd data center - cloudflare.com](https://blog.cloudflare.com/mombasa-kenya-cloudflares-43rd-data-center/)
30. [Cloud Latency in Africa - afpif.org](https://www.afpif.org/wp-content/uploads/2022/09/2-Cloud-Latency-in-Africa-JosiahChavula-Kigali-August2022.pdf)
31. [Cloudinary - Pricing and Plans - cloudinary.com](https://cloudinary.com/pricing)
32. [Compare Plans | Cloudinary - cloudinary.com](https://cloudinary.com/pricing/compare-plans)
33. [Cloudinary Pricing Tiers & Costs (Updated for 2026) - thedigitalprojectmanager.com](https://thedigitalprojectmanager.com/tools/cloudinary-pricing/)
34. [Cloudinary Pricing: A Comprehensive Guide | Capterra - capterra.com](https://www.capterra.com/p/135074/Cloudinary/pricing/)
35. [r/node on Reddit: Is Cloudinary free tier enough for a small e-commerce website - reddit.com](https://www.reddit.com/r/node/comments/16uktt5/is_cloudinary_free_tier_enough_for_a_small/)