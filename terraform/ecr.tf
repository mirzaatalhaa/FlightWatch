resource "aws_ecr_repository" "flightwatch_backend" {
  name = "flightwatch-backend"

  image_scanning_configuration {
    scan_on_push = true
  }
}