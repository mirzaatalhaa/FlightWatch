resource "aws_subnet" "flightwatch_public_subnet" {
  vpc_id                  = aws_vpc.flightwatch_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  availability_zone = "ap-south-1a"

  tags = {
    Name = "flightwatch-public-subnet"
  }
}

