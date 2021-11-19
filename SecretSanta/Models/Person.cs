﻿using System;
using System.Collections.Generic;
using System.Text;

namespace SecretSanta.Models
{
    public class Person
    {
        public Person(string name)
        {
            Name = name;
        }
        public string Name { get; set; }
        public int Code { get; set; }
        public Person? GiftingTo { get; set; }
        public bool IsGiftedTo { get; set; } = false;
        public string MessageType { get; set; } = MessageTypes.File;
        public string? PersonalIdCode { get; set; }
    }
}