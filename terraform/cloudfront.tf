resource "aws_cloudfront_distribution" "flightwatch_frontend" {
  enabled             = true
  default_root_object = "index.html"

  aliases = ["flight-watch.xyz"]

  origin {
    domain_name = aws_s3_bucket.flightwatch_frontend.website_endpoint
    origin_id   = "flightwatch-s3-origin"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"

      origin_ssl_protocols = [
        "TLSv1.2"
      ]
    }
  }

  default_cache_behavior {
    target_origin_id = "flightwatch-s3-origin"

    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = [
      "GET",
      "HEAD"
    ]

    cached_methods = [
      "GET",
      "HEAD"
    ]

    compress = true

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = "arn:aws:acm:us-east-1:424322298959:certificate/c8866cbd-9873-4ba7-8d2b-4d0c3d93116a"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}