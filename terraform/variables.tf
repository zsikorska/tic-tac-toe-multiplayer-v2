/* Issued by AWS Certificate Manager (ACM) */
variable "cert_arn" {
  type = string
  default = "arn:aws:acm:us-east-1:740943611122:certificate/07fcaf62-f045-4955-9fdc-b85ff39c99b1"
}

/* Frontend Domain */
variable "frontend_domain" {
  type = string
  default = "play.ttt-multiplayer.fun"
}
