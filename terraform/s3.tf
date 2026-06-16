resource "aws_s3_bucket" "flightwatch_frontend" {
  bucket = "flightwatch-frontend-talha"

  tags = {
    Name = "flightwatch-frontend"
  }
}

resource "aws_s3_bucket_website_configuration" "flightwatch_frontend_website" {
  bucket = aws_s3_bucket.flightwatch_frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "flightwatch_frontend" {
  bucket = aws_s3_bucket.flightwatch_frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "flightwatch_frontend" {
  bucket = aws_s3_bucket.flightwatch_frontend.id

  depends_on = [
    aws_s3_bucket_public_access_block.flightwatch_frontend
  ]

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "PublicRead"
        Effect = "Allow"

        Principal = "*"

        Action = [
          "s3:GetObject"
        ]

        Resource = [
          "${aws_s3_bucket.flightwatch_frontend.arn}/*"
        ]
      }
    ]
  })
}